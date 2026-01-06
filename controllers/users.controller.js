const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const { validatePhoneNumber } = require('../utils/validation');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { role: true },
            orderBy: { id: 'asc' }
        });
        // Remove passwords from response
        const sanitizedUsers = users.map(user => {
            const { password, ...userWithoutPassword } = user;
            return userWithoutPassword;
        });
        res.json(sanitizedUsers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUser = async (req, res) => {
    const { name, email, password, roleId, phoneNumber } = req.body;
    try {
        if (phoneNumber) {
            const validPhone = validatePhoneNumber(phoneNumber);
            if (!validPhone) {
                return res.status(400).json({ error: 'Invalid phone number' });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roleId: parseInt(roleId),
                phoneNumber: phoneNumber ? validatePhoneNumber(phoneNumber) : null
            },
            include: { role: true }
        });
        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, roleId, password, phoneNumber } = req.body;

    try {
        const updateData = {
            name,
            email,
            roleId: roleId ? parseInt(roleId) : undefined,
            phoneNumber: phoneNumber ? validatePhoneNumber(phoneNumber) : (phoneNumber === "" ? null : undefined)
        };

        if (phoneNumber) {
            const validPhone = validatePhoneNumber(phoneNumber);
            if (!validPhone) {
                return res.status(400).json({ error: 'Invalid phone number' });
            }
            updateData.phoneNumber = validPhone;
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: updateData,
            include: { role: true }
        });

        const { password: _, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
