const prisma = require('../prismaClient');

exports.getAllMisas = async (req, res) => {
    try {
        const misas = await prisma.misa.findMany({
            include: {
                misaSongs: {
                    include: {
                        song: true,
                        moment: true
                    }
                }
            },
            orderBy: { dateMisa: 'desc' }
        });
        res.json(misas);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMisaById = async (req, res) => {
    const { id } = req.params;
    try {
        const misa = await prisma.misa.findUnique({
            where: { id: parseInt(id) },
            include: {
                misaSongs: {
                    include: {
                        song: true,
                        moment: true
                    },
                    orderBy: { id: 'asc' } // Or order by moment if preferred
                }
            }
        });
        if (!misa) return res.status(404).json({ error: 'Misa not found' });
        res.json(misa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMisa = async (req, res) => {
    const { title, dateMisa } = req.body;
    try {
        const misa = await prisma.misa.create({
            data: {
                title,
                dateMisa: new Date(dateMisa),
            },
        });
        res.json(misa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMisa = async (req, res) => {
    const { id } = req.params;
    const { title, dateMisa } = req.body;
    try {
        const misa = await prisma.misa.update({
            where: { id: parseInt(id) },
            data: {
                title,
                dateMisa: dateMisa ? new Date(dateMisa) : undefined,
            },
        });
        res.json(misa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMisa = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.misa.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Misa deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// MisaSong Management
exports.addSongToMisa = async (req, res) => {
    const { id } = req.params; // Misa ID
    const { songId, momentId, key } = req.body;
    try {
        const misaSong = await prisma.misaSong.create({
            data: {
                misaId: parseInt(id),
                songId: parseInt(songId),
                momentId: momentId ? parseInt(momentId) : null,
                key: key || null
            },
            include: { song: true, moment: true }
        });
        res.json(misaSong);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.removeSongFromMisa = async (req, res) => {
    const { misaSongId } = req.params;
    try {
        await prisma.misaSong.delete({
            where: { id: parseInt(misaSongId) }
        });
        res.json({ message: 'Song removed from misa' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
