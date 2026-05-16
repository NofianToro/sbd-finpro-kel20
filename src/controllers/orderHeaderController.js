const orderHeaderRepo = require("../repositories/orderHeaderRepository");
const restaurantRepository = require("../repositories/restaurantRepository");

const orderHeaderController = {
    createOrderHeader: async (req, res) => {
        const { user_id, restaurant_id, order_amount, order_status, location } =
            req.body;

        if (
            !user_id ||
            !restaurant_id ||
            !order_amount ||
            !order_status ||
            !location
        ) {
            return res.status(400).json({
                success: false,
                message: "Required fields are missing",
                data: null,
            });
        }

        try {
            const order = await orderHeaderRepo.createOrderHeader({
                user_id,
                restaurant_id,
                order_amount,
                order_status,
                location,
            });

            res.status(201).json({
                success: true,
                message: "Successfully created order",
                data: order,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    },
    getAllOrderHeader: async (req, res) => {
        try {
            const orders = await orderHeaderRepo.getAllOrderHeader();

            res.status(200).json({
                success: true,
                message: "Successfully retrieved orders",
                data: orders,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    },
    getOrderHeaderbyOrderId: async (req, res) => {
        try {
            const { order_id } = req.params;
            const order = await orderHeaderRepo.getOrderHeaderById(order_id);

            res.status(200).json({
                success: true,
                message: "Successfully retrieved order header",
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    },
    getOrderHeaderbyUserId: async (req, res) => {
        try {
            const { user_id } = req.params;
            const order = await orderHeaderRepo.getOrderHeaderByUserId(user_id);

            res.status(200).json({
                success: true,
                message: "Successfully retrieved order header",
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    },
    getOrderHeaderByRestaurantId: async (req, res) => {
        try {
            const { restaurant_id } = req.params;
            const order = await orderHeaderRepo.getOrderHeaderById(restaurant_id);

            res.status(200).json({
                success: true,
                message: "Successfully retrieved order header",
                data: user,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                data: error.message,
            });
        }
    },
};

module.exports = orderHeaderController;
