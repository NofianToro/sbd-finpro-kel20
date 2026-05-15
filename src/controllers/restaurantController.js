const { Result } = require('pg');
const restoRepo = require('../repositories/restaurantRepository');

const restaurantController = {
    getAllRestaurant: async (req, res) => {
        try {
            const result = await restoRepo.getAllRestaurant();
            res.status(200).json({
                success: true,
                message: 'Successfully retrieve all restaurant',
                data: result,
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


module.exports = restaurantController;