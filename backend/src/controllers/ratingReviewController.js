const ratingReviewRepo = require('../repositories/ratingReviewRepository');

const ratingReviewController = {
    createReview: async (req, res) => {
        const {
            user_id,
            food_id,
            rating,
            review
        } = req.body;

        if (!user_id || !food_id || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing',
                data: null
            });
        }

        try {
            const newReview = await ratingReviewRepo.createReview({
                user_id,
                food_id,
                rating,
                review
            });

            res.status(201).json({
                success: true,
                message: 'Successfully created review',
                data: newReview
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: error.message
            });
        }
    },
    getReviewByFoodId: async (req, res) => {
        try {
            const { food_id }  = req.params;
            const rating = await ratingReviewRepo.getReviewByFoodId(food_id);
            res.status(200).json({
                success: true,
                message: `Successfully retrieve rating`,
                data: rating,
            });
        } catch (error) {
            res.status(500).json({
                success:false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    },
};

module.exports = ratingReviewController;