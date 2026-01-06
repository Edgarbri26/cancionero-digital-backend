const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validatePhoneNumber } = require('../utils/validation');

const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key_change_me';

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: {
                    include: {
                        permissions: true
                    }

                }

            },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const permissions = user.role.permissions.map(p => p.name);

        // Generate Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role.name, permissions },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        // Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            sameSite: 'lax' // Allows cookie to be sent on same-site navigation
        });

        res.json({ message: 'Login successful', user: { id: user.id, email: user.email, role: user.role.name, permissions } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.register = async (req, res) => {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password are required' });
    }

    try {
        if (phoneNumber) {
            const validPhone = validatePhoneNumber(phoneNumber);
            if (!validPhone) {
                return res.status(400).json({ error: 'Invalid phone number' });
            }
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'El usuario ya existe.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // find USER role
        let role = await prisma.role.findUnique({ where: { name: 'USER' } });
        // Fail-safe if role not found by name (e.g. casing), try ID 2
        if (!role) role = { id: 2 };

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                password: hashedPassword,
                roleId: role.id,
                phoneNumber: phoneNumber ? validatePhoneNumber(phoneNumber) : null
            }
        });

        res.status(201).json({ message: 'Usuario registrado correctamente', user: { id: user.id, email: user.email, name: user.name } });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ error: error.message });
    }
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

exports.me = (req, res) => {
    // If middleware passed, req.user is set
    res.json({ user: req.user });
};
