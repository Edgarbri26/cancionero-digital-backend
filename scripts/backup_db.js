const prisma = require('../prismaClient');
const fs = require('fs');
const path = require('path');

async function backup() {
    console.log('Starting backup...');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, '..', 'backups', timestamp);

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    console.log(`Saving backups to: ${backupDir}`);

    // Helper to backup a model
    const backupModel = async (modelName, findArgs = {}) => {
        try {
            const data = await prisma[modelName].findMany(findArgs);
            fs.writeFileSync(
                path.join(backupDir, `${modelName}.json`),
                JSON.stringify(data, null, 2)
            );
            console.log(`✅ Backed up ${data.length} ${modelName}s`);
        } catch (error) {
            console.error(`❌ Failed to backup ${modelName}:`, error.message);
        }
    };

    // Backup independent tables first (in theory, but order doesn't strictly matter for JSON dump)
    await backupModel('permission');
    await backupModel('role', { include: { permissions: true } }); // Include permissions to preserve relations reference

    // Explicitly select fields for User to avoid selecting 'phoneNumber' which exists in schema but not yet in DB
    await backupModel('user', {
        select: {
            id: true,
            name: true,
            email: true,
            password: true,
            roleId: true
        }
    });

    await backupModel('category');
    await backupModel('moment');

    // Backup dependent tables
    await backupModel('song');
    await backupModel('misa');
    await backupModel('misaSong');

    console.log('Backup process completed.');
}

backup()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
