const prisma = require('../prismaClient');

exports.getAllSongs = async (req, res) => {
    try {
        const { q, categoryId, limit } = req.query;
        const where = {};

        if (categoryId) {
            where.categoryId = parseInt(categoryId);
        }

        // If searching, we currently filter in memory, so we can't limit in DB efficiently without moving search to DB.
        // For now, if NO search query, we limit in DB.
        // If there IS a search query, we simply fetch all matching and then potentially slice (though the user requirement is mainly for the home page which has no query).
        const queryOptions = {
            where,
            include: { category: true },
            orderBy: { id: 'desc' } // Always order by newest
        };

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
            include: { category: true },
        });
        if (!song) return res.status(404).json({ error: 'Song not found' });
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateSong = async (req, res) => {
    const { id } = req.params;
    const { title, artist, content, key, url_song, categoryId } = req.body;
    try {
        const song = await prisma.song.update({
            where: { id: parseInt(id) },
            data: {
                title,
                artist,
                content,
                key,
                url_song,
                categoryId: parseInt(categoryId),
            },
        });
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
