const prisma = require('../prismaClient');

exports.getAllSongs = async (req, res) => {
    try {
        const { q, categoryId, limit } = req.query;
        const where = {};

        if (categoryId) {
            where.categoryId = parseInt(categoryId);
        }

        // By default show only active, unless 'all' query param is present
        // However, for admin views we might want all.
        // Let's check headers or a specific query param.
        // For simplicity: if req.user has permission 'song.edit', show all?
        // Or just add a query param 'includeInactive=true'
        // Check role from optionalAuth
        const isAdmin = req.user?.role === 'ADMIN';

        // Default: Show only active songs
        let activeFilter = true;

        if (isAdmin) {
            if (req.query.active === 'false') {
                activeFilter = false;
            } else if (req.query.active === 'all') {
                activeFilter = undefined;
            }
        }

        if (activeFilter !== undefined) {
            where.active = activeFilter;
        }

        // If searching, we currently filter in memory, so we can't limit in DB efficiently without moving search to DB.
        // For now, if NO search query, we limit in DB.
        // If there IS a search query, we simply fetch all matching and then potentially slice (though the user requirement is mainly for the home page which has no query).
        const queryOptions = {
            where,
            orderBy: { id: 'desc' }
        };

        if (!q) {
            // Optimization: Select only necessary fields for list view (exclude 'content')
            queryOptions.select = {
                id: true,
                title: true,
                artist: true,
                key: true,
                url_song: true,
                active: true,
                categoryId: true,
                category: true,
                user: { select: { name: true } }
            };
        } else {
            // If searching, we need content for filtering (in-memory)
            queryOptions.include = { category: true, user: { select: { name: true } } };
        }

        if (!q && limit) {
            queryOptions.take = parseInt(limit);
        }

        const songs = await prisma.song.findMany(queryOptions);

        if (!q) {
            return res.json(songs);
        }

        const normalize = (str) => {
            return str
                ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
                : "";
        };

        const stripChords = (str) => {
            return str ? str.replace(/\[.*?\]/g, "") : "";
        };

        const search = normalize(q);

        const filteredSongs = songs.filter((song) => {
            const cleanContent = stripChords(song.content);
            return (
                normalize(song.title).includes(search) ||
                normalize(song.artist).includes(search) || // Author search is already covered here
                normalize(cleanContent).includes(search)
            );
        });

        res.json(filteredSongs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSong = async (req, res) => {
    const { title, artist, content, key, url_song, categoryId } = req.body;
    try {
        const song = await prisma.song.create({
            data: {
                title,
                artist,
                content,
                key,
                url_song,
                categoryId: parseInt(categoryId), // Ensure it's an integer
                active: true,
                userId: req.user ? req.user.id : null // Save the user who created the song
            },
        });
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSongById = async (req, res) => {
    const { id } = req.params;
    try {
        const song = await prisma.song.findUnique({
            where: { id: parseInt(id) },
            include: { category: true, user: { select: { name: true } } },
        });
        if (!song) return res.status(404).json({ error: 'Song not found' });
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSong = async (req, res) => {
    const { id } = req.params;
    const { title, artist, content, key, url_song, categoryId, active } = req.body;
    try {
        const data = {};
        if (title !== undefined) data.title = title;
        if (artist !== undefined) data.artist = artist;
        if (content !== undefined) data.content = content;
        if (key !== undefined) data.key = key;
        if (url_song !== undefined) data.url_song = url_song;
        if (categoryId !== undefined) data.categoryId = parseInt(categoryId);
        if (active !== undefined) data.active = active;

        const song = await prisma.song.update({
            where: { id: parseInt(id) },
            data
        });
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteSong = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.song.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Song deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
