const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key_change_me';

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                role: {
                    include: { permissions: true }
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

exports.logout = (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out successfully' });
};

exports.me = (req, res) => {
    // If middleware passed, req.user is set
    res.json({ user: req.user });
};
