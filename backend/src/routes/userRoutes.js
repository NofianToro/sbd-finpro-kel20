const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const userController = require('../controllers/userController');
const ratingReviewController = require('../controllers/ratingReviewController');
const orderHeaderController = require('../controllers/orderHeaderController');
const orderDetailController = require('../controllers/orderDetailController');
const billController = require('../controllers/billController');
const favoriteController = require('../controllers/favoriteController');

const { userRegistrationValidation, validate } = require('../utils/validators');

// auth
router.post('/register', userRegistrationValidation, validate, userController.createUser);
router.post('/login', userController.loginUser);

// user profile
router.get('/profile/:user_id', authenticateToken, authorizeRoles("user") ,userController.getProfile);
router.get('/getAll', userController.getAllUser);


// add a favorite
router.post('/favorites/:food_id', authenticateToken, authorizeRoles('user'), favoriteController.addFavorite);
//del favorite
router.delete('/favorites/:food_id',authenticateToken,  authorizeRoles('user'), favoriteController.removeFavorite);
// get user fac
router.get('/favorites/:user_id', authenticateToken,authorizeRoles('user'),favoriteController.getFavoritesByUserId);

// add saldo
router.put('/topUp/:user_id', authenticateToken, authorizeRoles('user'), userController.userTopUpSaldo)

// create order
router.post('/orders', authenticateToken, authorizeRoles('user'), orderHeaderController.createOrderHeader);
// add order item
router.post('/orders/detail', authenticateToken, authorizeRoles('user'), orderDetailController.createOrderDetail);

// get user order
// by user
router.get('/orders/user/:user_id', authenticateToken,  authorizeRoles('user'), orderHeaderController.getOrderHeaderbyUserId);
// specific order]
router.get('/orders/:order_id', authenticateToken, authorizeRoles('user'), orderHeaderController.getOrderHeaderbyOrderId);

// get order item
router.get('/orders/:order_id/items', authenticateToken,authorizeRoles('user'), orderDetailController.getOrderDetailByOrderId);

// create bill when checkout
router.post('/orders/:order_id/bill', authenticateToken, authorizeRoles('user'), billController.createBill);
// get bill
router.get('/orders/:order_id/bill', authenticateToken,authorizeRoles('user'), billController.getBillByOrderId);


// create review
router.post('/reviews', authenticateToken, authorizeRoles('user'), ratingReviewController.createReview);

// get review for specific food
router.get('/reviews/food/:food_id', ratingReviewController.getReviewByFoodId)

module.exports = router;