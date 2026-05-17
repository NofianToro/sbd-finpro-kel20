const express = require("express");
const router = express.Router();

const { authenticateToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const restaurantController = require("../controllers/restaurantController");
const foodController = require("../controllers/foodController");
const orderHeaderController = require('../controllers/orderHeaderController');
const ratingReviewController = require('../controllers/ratingReviewController');

const { userRegistrationValidation, validate } = require("../utils/validators");
const billController = require("../controllers/billController");

router.post("/register", userRegistrationValidation, validate, restaurantController.createRestaurant);

router.post("/login", restaurantController.loginRestaurant);

// public restaurant routes
router.get("/", restaurantController.getAllRestaurant);
router.get("/:restaurant_id", restaurantController.getFoodByRestaurantId);

// public food routes
router.get("/foods", foodController.getAllFood);
router.get("/foods/:food_id", foodController.getFoodById);
router.get("/:restaurant_id/foods", foodController.getFoodByRestaurantId);

// restricted food routes 
router.post("/foods", authenticateToken, authorizeRoles("restaurant"), foodController.createFood);
router.put("/profile/image/:restaurant_id", authenticateToken,authorizeRoles("restaurant"), restaurantController.updateRestaurantImage);

// to check order
router.get("/orders", authorizeRoles("restaurant"), orderHeaderController.getOrderHeaderByRestaurantId);
//specific order
router.get("/orders", authorizeRoles("restaurant"), orderHeaderController.getOrderHeaderbyOrderId);

// get bill
router.get('/orders/:order_id/bill', authorizeRoles('restaurant'), billController.getBillByOrderId );
// create bill
router.get('/orders/bill', authorizeRoles('restaurant'), billController.createBill);

// get review for specific food
router.get('/reviews/food/:food_id', ratingReviewController.getReviewByFoodId)

module.exports = router;