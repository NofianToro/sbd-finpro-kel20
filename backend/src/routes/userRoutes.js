const express = require('express');
const router = express.Router();

const { authenticateToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const userController = require('../controllers/userController');
const ratingReviewController = require('../controllers/ratingReviewController');
const orderHeaderController = require('../controllers/orderHeaderController');
const orderDetailController = require('../controllers/orderDetailController');
const billController = require('../controllers/billController');

const { userRegistrationValidation, validate } = require('../utils/validators');

// auth
router.post('/register', userRegistrationValidation, validate, userController.createUser);
router.post('/login', userController.loginUser);

// user profile
router.get('/getAll', userController.getAllUser);
router.get('/getById/:user_id', userController.getUserById);

// create order
router.post('/orders', authenticateToken, authorizeRoles('user'), orderHeaderController.createOrderHeader);
router.post('/orders/detail', authenticateToken, authorizeRoles('user'), orderDetailController.createOrderDetail);

// get user order
// by user
router.get('orders', authenticateToken, authorizeRoles, authorizeRoles('user'), orderHeaderController.getOrderHeaderbyUserId);
// specific order]
router.get('orders', authenticateToken, authorizeRoles, authorizeRoles('user'), orderHeaderController.getOrderHeaderbyOrderId);

// get bill
router.get('/orders/:order_id/bill', authorizeRoles('user'), billController.getBillByOrderId);


// create review
router.post('/reviews', authorizeRoles('user'), ratingReviewController.createReview);

// get review for specific food
router.get('/reviews/food/:food_id', ratingReviewController.getReviewByFoodId)

module.exports = router;