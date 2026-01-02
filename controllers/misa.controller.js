const prisma = require('../prismaClient');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key_change_me';

const getUserId = (req) => {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return null;
    try {
        const user = jwt.verify(token, SECRET_KEY);
        return user.id;
    } catch (err) {
        return null;
    }
};

exports.getAllMisas = async (req, res) => {
    const userId = getUserId(req);
    try {
        const whereClause = {
            OR: [
                { visibility: 'PUBLIC' }
            ]
        };

        if (userId) {
            whereClause.OR.push({ userId: userId });
        }

        const misas = await prisma.misa.findMany({
            where: whereClause,
            include: {
                misaSongs: {
                    include: {
                        song: true,
                        moment: true
                    }
                },
                user: { select: { name: true } }
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
    const { token: shareToken } = req.query;
    const userId = getUserId(req);

    try {
        const misa = await prisma.misa.findUnique({
            where: { id: parseInt(id) },
            include: {
                misaSongs: {
                    include: {
                        song: true,
                        moment: true
                    },
                    orderBy: { id: 'asc' }
                },
                user: { select: { name: true } }
            }
        });

        if (!misa) return res.status(404).json({ error: 'Misa not found' });

        const isOwner = userId && misa.userId === userId;
        const isPublic = misa.visibility === 'PUBLIC';
        const hasValidToken = shareToken && shareToken === misa.shareToken;

        if (!isPublic && !isOwner && !hasValidToken) {
            return res.status(403).json({ error: 'Access denied' });
        }

        res.json({ ...misa, isOwner });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMisa = async (req, res) => {
    const { title, dateMisa, visibility } = req.body;
    // req.user is set by middleware
    const userId = req.user ? req.user.id : null;

    try {
        const misa = await prisma.misa.create({
            data: {
                title,
                dateMisa: new Date(dateMisa),
                visibility: visibility || "PUBLIC",
                userId: userId
            },
        });
        res.json(misa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateMisa = async (req, res) => {
    const { id } = req.params;
    const { title, dateMisa, visibility } = req.body;
    const userId = req.user ? req.user.id : null;

    try {
        // Check ownership
        const existingMisa = await prisma.misa.findUnique({ where: { id: parseInt(id) } });
        if (!existingMisa) return res.status(404).json({ error: 'Misa not found' });

        if (existingMisa.userId && existingMisa.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this misa' });
        }

        const misa = await prisma.misa.update({
            where: { id: parseInt(id) },
            data: {
                title,
                dateMisa: dateMisa ? new Date(dateMisa) : undefined,
                visibility
            },
        });
        res.json(misa);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteMisa = async (req, res) => {
    const { id } = req.params;
    const userId = req.user ? req.user.id : null;

    try {
        // Check ownership
        const existingMisa = await prisma.misa.findUnique({ where: { id: parseInt(id) } });
        if (!existingMisa) return res.status(404).json({ error: 'Misa not found' });

        if (existingMisa.userId && existingMisa.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this misa' });
        }

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
    const userId = req.user ? req.user.id : null;

    try {
        // Check ownership of Misa
        const misa = await prisma.misa.findUnique({ where: { id: parseInt(id) } });
        if (!misa) return res.status(404).json({ error: 'Misa not found' });
        if (misa.userId && misa.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

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
    const { id: misaId, misaSongId } = req.params;
    const userId = req.user ? req.user.id : null;

    try {
        // Check ownership of Misa
        const misa = await prisma.misa.findUnique({ where: { id: parseInt(misaId) } });
        if (!misa) return res.status(404).json({ error: 'Misa not found' });
        if (misa.userId && misa.userId !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await prisma.misaSong.delete({
            where: { id: parseInt(misaSongId) }
        });
        res.json({ message: 'Song removed from misa' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
