const prisma = require('../prismaClient');

exports.getAllCategories = async (req, res) => {
    try {
        const isAdmin = req.user?.role === 'ADMIN';
        const where = isAdmin ? {} : { isSecret: false };

        const categories = await prisma.category.findMany({ where });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategory = async (req, res) => {
    const { name } = req.body;
    try {
        const category = await prisma.category.create({
            data: { name },
        });
        res.json(category);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
