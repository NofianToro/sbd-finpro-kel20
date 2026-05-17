const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const restaurantController = require("../controllers/restaurantController");
const foodController = require("../controllers/foodController");
const orderHeaderController = require('../controllers/orderHeaderController');
const orderDetailController = require('../controllers/orderDetailController');
const ratingReviewController = require('../controllers/ratingReviewController');
const billController = require("../controllers/billController");

const { userRegistrationValidation, validate } = require("../utils/validators");


router.post("/register", userRegistrationValidation, validate, restaurantController.createRestaurant); //register

router.post("/login", restaurantController.loginRestaurant); //login

// public restaurant routes
router.get("/", restaurantController.getAllRestaurant);
router.get("/restaurant/:username", restaurantController.getRestaurantByUsername);

// public food routes
router.get("/foods", foodController.getAllFood);
router.get("/foods/:food_id", foodController.getFoodById);
router.get("/:restaurant_id/foods", foodController.getFoodByRestaurantId);

// restricted food routes 
router.post("/foods", authenticateToken, authorizeRoles("restaurant"), foodController.createFood);

// edit profile restaurant
router.put("/profile/image/:restaurant_id", authenticateToken,authorizeRoles("restaurant"), restaurantController.updateRestaurantImage);

// to check order
router.get("/orders/all/:restaurant_id", authenticateToken,authorizeRoles("restaurant"), orderHeaderController.getOrderHeaderByRestaurantId);
//specific order
router.get("/orders/:order_id", authenticateToken,authorizeRoles("restaurant"), orderHeaderController.getOrderHeaderbyOrderId);

//get order item
router.get("/orders/:order_id/items", authenticateToken,authorizeRoles("restaurant"), orderDetailController.getOrderDetailByOrderId);
//update order status
router.put("/orders/:order_id/status",authenticateToken, authorizeRoles("restaurant"), orderHeaderController.updateOrderStatus);


// get bill
router.get('/orders/:order_id/bill', authenticateToken,authorizeRoles('restaurant'), billController.getBillByOrderId );
// create bill
router.post('/orders/:order_id/bill', authenticateToken,authorizeRoles('restaurant'), billController.createBill);
//update bill
router.put('/orders/:order_id/bill',authenticateToken, authorizeRoles('restaurant'), billController.updateBill);
// get review for specific food
router.get('/reviews/food/:food_id', ratingReviewController.getReviewByFoodId)

module.exports = router;