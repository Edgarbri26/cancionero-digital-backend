const prisma = require('../prismaClient');

exports.getStats = async (req, res) => {
    try {
        const [totalSongs, totalCategories] = await Promise.all([
            prisma.song.count(),
            prisma.category.count(),
        ]);

        res.json({
            totalSongs,
            totalCategories
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
