const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.get('/getAll', userController.getAllUser);
router.post('/create', userController.createUser);
router.get('/getById/:user_id', userController.getUserById);

module.exports = router;