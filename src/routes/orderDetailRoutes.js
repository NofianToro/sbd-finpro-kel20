const express = require('express');
const router = express.Router();

const orderDetailController = require('../controllers/orderDetailController');

router.post('/create', orderDetailController.createOrderDetail);

module.exports = router;