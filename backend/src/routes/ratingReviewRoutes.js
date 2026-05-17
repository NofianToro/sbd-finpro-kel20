const express = require('express');
const router = express.Router();

const ratingReviewController = require('../controllers/ratingReviewController');

router.post('/create', ratingReviewController.createReview);

module.exports = router;