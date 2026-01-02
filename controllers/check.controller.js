const prisma = require('../prismaClient');

exports.checkConnection = async (req, res) => {
    try {
        // Simple query to verify DB connection
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ status: 'ok', message: 'Database connection successful' });
    } catch (error) {
        console.error('Database connection failed:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed', error: error.message });
    }
};
