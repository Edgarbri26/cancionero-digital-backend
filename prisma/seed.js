const prisma = require('../prismaClient');
const bcrypt = require('bcryptjs');

async function main() {
    console.log('Start seeding ...');

    // Permissions
    const permissions = [
        'user.view', 'user.create', 'user.edit', 'user.delete',
        'role.view', 'role.edit',
        'song.view', 'song.create', 'song.edit', 'song.delete',
        'misa.view', 'misa.create', 'misa.edit', 'misa.delete',
    ];

    const permissionRecords = {};
    for (const perm of permissions) {
        permissionRecords[perm] = await prisma.permission.upsert({
            where: { name: perm },
            update: {},
            create: { name: perm },
        });
    }

    console.log('Permissions created.');

    // Roles
    const adminRole = await prisma.role.upsert({
        where: { id: 1 },
        update: {
            permissions: {
                connect: permissions.map(p => ({ name: p }))
            }
        },
        create: {
            name: 'ADMIN',
            permissions: {
                connect: permissions.map(p => ({ name: p }))
            }
        },
    });

    const userPermissions = ['song.view', 'misa.view'];
    const userRole = await prisma.role.upsert({
        where: { id: 2 },
        update: {
            permissions: {
                connect: userPermissions.map(p => ({ name: p }))
            }
        },
        create: {
            name: 'USER',
            permissions: {
                connect: userPermissions.map(p => ({ name: p }))
            }
        },
    });

    console.log('Roles created.');

    // Categories
    const catAdoracion = await prisma.category.create({
        data: { name: 'Adoración' },
    });

    const catAlabanza = await prisma.category.create({
        data: { name: 'Alabanza' },
    });

    console.log('Categories created.');

    // Moments
    const moments = ["Entrada", "Piedad", "Gloria", "Aleluya", "Ofertorio", "Santo", "Cordero", "Comunión", "Salida"];

    for (const moment of moments) {
        await prisma.moment.upsert({
            where: { nombre: moment },
            update: {},
            create: { nombre: moment },
        });
    }

    console.log('Moments created.');

    // User
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@admin.com' },
        update: {
            password: hashedPassword // Update password even if user exists to ensure hash
        },
        create: {
            email: 'admin@admin.com',
            name: 'Admin User',
            password: hashedPassword,
            roleId: adminRole.id,
        },
    });

    console.log('Admin user created.');

    // Songs
    await prisma.song.create({
        data: {
            title: 'Tu Fidelidad',
            artist: 'Marcos Witt',
            content: 'Tu fid[C]elidad es grande...',
            key: 'D',
            categoryId: catAdoracion.id,
        },
    });

    await prisma.song.create({
        data: {
            title: 'Renuévame',
            artist: 'Marcos Witt',
            content: 'Renuéva[Dm]me, Señor Jesús...',
            key: 'D',
            categoryId: catAdoracion.id,
        },
    });

    await prisma.song.create({
        data: {
            title: 'Cantaré al Señor por siempre',
            artist: 'Palabra en Acción',
            content: 'Cant[Em]aré al Señor por siempre, su diestra es todo poder...',
            key: 'Em',
            categoryId: catAlabanza.id,
        },
    });

    console.log('Songs created.');
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
