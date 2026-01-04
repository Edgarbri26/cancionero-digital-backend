const prisma = require('../prismaClient');

exports.getAllRoles = async (req, res) => {
    try {
        const roles = await prisma.role.findMany({
            include: {
                permissions: true
            }
        });
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createRole = async (req, res) => {
    try {
        console.log("Create Role Request Body:", req.body);
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: "Name is required" });

        const role = await prisma.role.create({
            data: { name }
        });
        res.json(role);
    } catch (error) {
        console.error("Create Role Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const role = await prisma.role.update({
            where: { id: parseInt(id) },
            data: { name }
        });
        res.json(role);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
