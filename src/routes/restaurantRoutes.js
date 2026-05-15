const express = require('express');
const router = express.Router();

const restaurantController = require('../controllers/restaurantController');

router.get('/getAll', restaurantController.getAllRestaurant);
router.post('/create', restaurantController.createRestaurant);
router.get('/getByUsername/:username', restaurantController.getRestaurantByUsername);
router.put(
    '/updateImage/:restaurant_id',
    restaurantController.updateRestaurantImage
);

module.exports = router;