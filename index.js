require('dotenv').config();
const express = require('express');
const { connect } = require('./src/database/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const restaurantRoutes = require('./src/routes/restaurant.route');
const foodRoutes = require('./src/routes/food.route');
const userRoutes = require('./src/routes/user.route');
const orderHeaderRoutes = require('./src/routes/orderHeader.route');
const orderDetailRoutes = require('./src/routes/orderDetail.route');
const ratingReviewRoutes = require('./src/routes/ratingReview.route');
const billRoutes = require('./src/routes/bill.route');

const app = express();

// rate limiter 5 requests per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests
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

// helmet
app.use(helmet());
// cors
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiter on auth endpoints
app.use('/user/login', authLimiter);
app.use('/user/register', authLimiter);
app.use('/restaurants/login', authLimiter);
app.use('/restaurants/register', authLimiter);


// routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/order-header', orderHeaderRoutes);
app.use('/api/order-detail', orderDetailRoutes);
app.use('/api/reviews', ratingReviewRoutes);
app.use('/api/bills', billRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
});