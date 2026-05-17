const { Result } = require('pg');
const restoRepo = require('../repositories/restaurantRepository');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

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
        try {

            const {
                username,
                display_name,
                url_img,
                phone,
                password
            } = req.body;

            const existing =
                await restoRepo.getRestaurantByUsername(username);

            if (existing) {

                return res.status(400).json({
                    success: false,
                    message: 'Username already exists',
                    data: null,
                });
            }

            const hashedPassword =
                await bcrypt.hash(password, saltRounds);

            const restaurant =
                await restoRepo.createRestaurant({
                    username,
                    display_name,
                    url_img,
                    phone,
                    password: hashedPassword,
                });

            res.status(201).json({
                success: true,
                message: 'Restaurant registered successfully',
                data: restaurant,
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message,
                data: null,
            });
        }
    },
    loginRestaurant: async (req,res) => {
        try {

            const { username, password } = req.body;

            const restaurant =
                await restoRepo.getRestaurantByUsername(username);

            if (!restaurant) {

                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password',
                    data: null,
                });
            }

            const isMatch =
                await bcrypt.compare(
                    password,
                    restaurant.password
                );

            if (!isMatch) {

                return res.status(401).json({
                    success: false,
                    message: 'Invalid username or password',
                    data: null,
                });
            }

            const token = jwt.sign(
                {
                    restaurant_id: restaurant.restaurant_id,
                    username: restaurant.username,
                    role: 'restaurant',
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h',
                }
            );

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    restaurant: {
                        restaurant_id:
                            restaurant.restaurant_id,

                        username:
                            restaurant.username,

                        display_name:
                            restaurant.display_name,
                    }
                }
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message,
                data: null,
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