const prisma = require('../prismaClient');

const getAllPermissions = async (req, res) => {
    try {
        const permissions = await prisma.permission.findMany();
        res.json(permissions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching permissions' });
    }
};

const updateRolePermissions = async (req, res) => {
    const { roleId } = req.params;
    const { permissionNames } = req.body; // Array of permission names

    try {
        // First disconnect all existing permissions
        await prisma.role.update({
            where: { id: parseInt(roleId) },
            data: {
                permissions: {
                    set: []
                }
            }
        });

        // Then connect new ones
        const updatedRole = await prisma.role.update({
            where: { id: parseInt(roleId) },
            data: {
                permissions: {
                    connect: permissionNames.map(name => ({ name }))
                }
            },
            include: { permissions: true }
        });

        res.json(updatedRole);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating role permissions' });
    }
};

module.exports = {
    getAllPermissions,
    updateRolePermissions
};
