const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const SECRET_KEY = process.env.JWT_SECRET || 'your_super_secret_key_change_me';

exports.authenticateToken = (req, res, next) => {
    // Check for token in cookies or Authorization header
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};

exports.optionalAuth = (req, res, next) => {
    const token = req.cookies?.token || req.headers['authorization']?.split(' ')[1];
    if (!token) return next();

    try {
        const user = jwt.verify(token, SECRET_KEY);
        req.user = user;
    } catch (err) {
        // Ignore invalid token for optional auth
    }
    next();
};

exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({ error: 'Admin privileges required' });
    }
};

exports.authorizePermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'User not authenticated' });
            }

            // Always allow ADMIN (optional, but convenient)
            if (req.user.role === 'ADMIN') {
                return next();
            }

            const userWithPermissions = await prisma.user.findUnique({
                where: { id: req.user.id },
                include: {
                    role: {
                        include: { permissions: true }
                    }
                }
            });

            if (!userWithPermissions) {
                return res.status(403).json({ error: 'User not found' });
            }

            const hasPermission = userWithPermissions.role.permissions.some(p => p.name === permissionName);

            if (hasPermission) {
                next();
            } else {
                res.status(403).json({ error: `Missing permission: ${permissionName} ` });
            }
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};
