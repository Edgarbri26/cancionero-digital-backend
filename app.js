const express = require('express');
const cors = require('cors');
require('dotenv').config();

const routes = require('./routes');

const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4321', // Frontend URL
    credentials: true // Allow cookies
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Lyrics App Backend is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
