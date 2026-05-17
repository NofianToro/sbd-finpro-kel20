require('dotenv').config({ path: '.env.new' });
const express = require('express');
const { connect } = require('./src/database/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const restaurantRoutes = require('./src/routes/restaurantRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();
// helmet
app.use(helmet());

// rate limiter 5 requests per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 5 requests
    message: {
        success: false,
        message: 'too many attempt, try again after 15 minutes',
        payload: null,
    }
});

const corsOptions ={
    origin: "http://localhost:3000",
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
};


// cors
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiter on auth endpoints
app.use('/api/user/login', authLimiter);
app.use('/api/user/register', authLimiter);
app.use('/api/restaurants/login', authLimiter);
app.use('/api/restaurants/register', authLimiter);


// routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
});