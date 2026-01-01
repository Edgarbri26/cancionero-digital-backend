const prisma = require('../prismaClient');

exports.getAllMoments = async (req, res) => {
    try {
        const moments = await prisma.moment.findMany();
        res.json(moments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createMoment = async (req, res) => {
    const { nombre } = req.body;
    try {
        const moment = await prisma.moment.create({
            data: { nombre },
        });
        res.json(moment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
