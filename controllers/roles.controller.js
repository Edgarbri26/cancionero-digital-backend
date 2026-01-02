const prisma = require('../prismaClient');

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await prisma.role.findMany();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
