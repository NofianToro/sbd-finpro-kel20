const express = require('express');
const router = express.Router();

const foodController = require('../controllers/foodController');

router.get('/getAll', foodController.getAllFood);
router.post('/create', foodController.createFood);
router.get('/getById/:food_id', foodController.getFoodById);
router.get('/getByName/:food_name', foodController.getFoodByName);
router.get(
    '/getByRestaurant/:restaurant_id',
    foodController.getFoodByRestaurantId
);

module.exports = router;