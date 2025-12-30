import config from './prisma.config.mjs';
import 'dotenv/config';

console.log('Loaded Config:', config);
console.log('DATABASE_URL env:', process.env.DATABASE_URL);
