import { defineConfig } from 'prisma/config';
import 'dotenv/config';

export default defineConfig({
    prisma: {
        schema: 'prisma/schema.prisma',
    },
    datasource: {
        url: process.env.DIRECT_URL || process.env.DATABASE_URL,
        directUrl: process.env.DIRECT_URL,
    },
    migrations: {
        seed: 'node prisma/seed.js',
    },
});
