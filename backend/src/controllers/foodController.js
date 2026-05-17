const foodRepo = require('../repositories/foodRepository');

const foodController = {

    createFood: async (req, res) => {
        const {
            restaurant_id,
            food_name,
            url_img,
            url_video,
            price,
            category,
            description,
            stok
        } = req.body;

        if (!restaurant_id || !food_name || !price || !category) {
            return res.status(400).json({
                success: false,
                message: 'restaurant_id, food_name, price, and category are required',
                data: null,
            });
        }

        try {
            const food = await foodRepo.createFood({
                restaurant_id,
                food_name,
                url_img,
                url_video,
                price,
                category,
                description,
                stok,
            });

            res.status(201).json({
                success: true,
                message: 'Successfully created food',
                data: food,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    },

    getFoodById: async (req, res) => {
        try {
            const { food_id } = req.params;

            const food = await foodRepo.getFoodbyId(food_id);

            if (!food) {
                return res.status(404).json({
                    success: false,
                    message: 'Food not found',
                    data: null,
                });
            }

            res.status(200).json({
                success: true,
                message: 'Successfully retrieved food',
                data: food,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    },

    getFoodByName: async (req, res) => {
        try {
            const { food_name } = req.params;

            const foods = await foodRepo.getFoodbyName(food_name);

            res.status(200).json({
                success: true,
                message: 'Successfully retrieved foods',
                data: foods,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    },

    getFoodByRestaurantId: async (req, res) => {
        try {
            const { restaurant_id } = req.params;

            const foods = await foodRepo.getFoodbyRestaurantId(restaurant_id);

            res.status(200).json({
                success: true,
                message: 'Successfully retrieved restaurant foods',
                data: foods,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    },

    getAllFood: async (req, res) => {
        try {
            const { search, category } = req.query;

            const foods = await foodRepo.getAllFood(search, category);

            res.status(200).json({
                success: true,
                message: 'Successfully retrieved all foods',
                data: foods,
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: error.message,
            });
        }
    },
    updateFoodStock: async (req, res) => {
    try {
        const { food_id } = req.params;
        const { stockChange } = req.body;
        if (
            stockChange === undefined
        ) {
            return res.status(400).json({
                success: false,
                message:'stockChange is required',
                data: null
            });
        }
        const food = await foodRepo.updateFoodStock(food_id, stockChange);
        if (!food) {
            return res.status(400).json({
                success: false,
                message:'Insufficient stock',
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message:'Successfully updated stock',
            data: food
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:'Internal Server Error',
            data: error.message
        });
    }
},
};

module.exports = foodController;