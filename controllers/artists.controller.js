const prisma = require('../prismaClient');

exports.getAllArtists = async (req, res) => {
    try {
        const artists = await prisma.artist.findMany({ include: { songs: true } });
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createArtist = async (req, res) => {
    const { name, genre } = req.body;
    try {
        const artist = await prisma.artist.create({
            data: { name, genre },
        });
        res.json(artist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
