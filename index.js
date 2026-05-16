require('dotenv').config();
const express = require('express');
const { connect } = require('./src/database/db');

const restaurantRoutes = require('./src/routes/restaurant.route');
const foodRoutes = require('./src/routes/food.route');
const userRoutes = require('./src/routes/user.route');
const orderHeaderRoutes = require('./src/routes/orderHeader.route');
const orderDetailRoutes = require('./src/routes/orderDetail.route');
const ratingReviewRoutes = require('./src/routes/ratingReview.route');
const billRoutes = require('./src/routes/bill.route');

const app = express();
app.use(express.json());

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