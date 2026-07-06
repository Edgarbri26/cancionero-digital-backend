const prisma = require('../prismaClient');
const cache = require('../services/cache.service');

const STATS_TTL = 3600; // 1 hour

exports.getStats = async (req, res) => {
    try {
        const cached = await cache.get('stats');
        if (cached) return res.json(cached);

        const [totalSongs, totalCategories] = await Promise.all([
            prisma.song.count(),
            prisma.category.count(),
        ]);

        const stats = { totalSongs, totalCategories };
        await cache.set('stats', stats, STATS_TTL);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
