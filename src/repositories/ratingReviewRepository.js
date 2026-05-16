const db = require('../database/db');

const ratingReviewRepository = {

    createReview: async (reviewData) => {
        const {
            user_id,
            food_id,
            rating,
            review
        } = reviewData;

        const query = `
            INSERT INTO rating_review
            (user_id, food_id, rating, review)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [user_id, food_id, rating, review];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    getReviewByFoodId: async (food_id) => {
        const query = `
            SELECT rr.*, mu.display_name
            FROM rating_review rr
            JOIN master_user mu ON rr.user_id = mu.user_id
            WHERE food_id = $1;
        `;

        try {
            const result = await db.query(query, [food_id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = ratingReviewRepository;