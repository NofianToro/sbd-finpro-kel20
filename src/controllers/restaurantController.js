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
        if(!username || !display_name || !url_img || !password || !phone) return res.status(400).json({
                success: false,
                message: 'Username, Display Name, Profile Image, Password, and Phone required',
                data: null,
            });
        try {
            const restaurant = await restoRepo.createRestaurant(username, display_name, url_img, password, phone);
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
            res.status(200).json({
                success: true,
                message: `Successfully retrieve ${username}`,
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                success:false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    }
};


module.exports = restaurantController;