const orderDetailRepo = require('../repositories/orderDetailRepository');

const orderDetailController = {

    createOrderDetail: async (req, res) => {
        const {
            order_id,
            food_id,
            quantity,
            total_harga_food
        } = req.body;

        if (!order_id || !food_id || !quantity || !total_harga_food) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing',
                data: null
            });
        }

        try {
            const detail = await orderDetailRepo.createOrderDetail({
                order_id,
                food_id,
                quantity,
                total_harga_food
            });

            res.status(201).json({
                success: true,
                message: 'Successfully created order detail',
                data: detail
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal Server Error',
                data: error.message
            });
        }
    }
};

module.exports = orderDetailController;