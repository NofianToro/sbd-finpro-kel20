require('dotenv').config();
const express = require('express');
const { connect } = require('./src/database/db');

const restaurantRoutes = require('./src/routes/restaurant.route');
const foodRoutes = require('./src/routes/food.route');

const app = express();
app.use(express.json());

// routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/foods', foodRoutes);


const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    try {
        await connect();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error('Database connection failed:', error.message);
    }
});