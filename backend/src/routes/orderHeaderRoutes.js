const express = require('express');
const router = express.Router();

const orderHeaderController = require('../controllers/orderHeaderController');

router.get('/getAll', orderHeaderController.getAllOrderHeader);
router.post('/create', orderHeaderController.createOrderHeader);

module.exports = router;