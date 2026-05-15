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
    createRestaurant: async (req, res) => {
        const { username, display_name, url_img, password, phone } = req.body;
        if(!username || !display_name || !password || !phone) return res.status(400).json({
                success: false,
                message: 'Username, display name, password, and phone required',
                data: null,
            });
        try {
            const restaurant = await restoRepo.createRestaurant({
                username, display_name, url_img, password, phone
            });
            res.status(200).json({
                success: true,
                message: 'Successfully create new restaurant',
                data: restaurant,
            });
        } catch (error) {
            res.status(500).json({
                success:false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    },
    getRestaurantByUsername: async (req, res) => {
        try {
            const { username }  = req.params;
            const restaurant = await restoRepo.getrestaurantByUsername(username);
            if (!restaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurant not found',
                    data: null,
                });
            }
            res.status(200).json({
                success: true,
                message: `Successfully retrieve ${username}`,
                data: restaurant,
            });
        } catch (error) {
            res.status(500).json({
                success:false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    },
    updateRestaurantImage: async (req, res) => {
        try {
            const { restaurant_id } = req.params;
            const { url_img } = req.body;

            if (!url_img) {
                return res.status(400).json({
                    success: false,
                    message: 'New image URL is required',
                    data: null,
                });
            }

            const updatedRestaurant = await restoRepo.updateRestaurantImage(
                restaurant_id,
                url_img
            );

            if (!updatedRestaurant) {
                return res.status(404).json({
                    success: false,
                    message: 'Restaurant not found',
                    data: null,
                });
            }

            res.status(200).json({
                success: true,
                message: 'Restaurant image updated successfully',
                data: updatedRestaurant,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    },
};


module.exports = restaurantController;