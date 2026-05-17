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
    },
    getOrderDetailByOrderId: async (req, res) => {

        try {

            const { order_id } = req.params;

            const details =
                await orderDetailRepo.getOrderDetailByOrderId(order_id);

            res.status(200).json({
                success: true,
                message: 'Successfully retrieved order details',
                data: details
            });

        } catch (error) {

            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    },

    updateOrderItemQuantity: async (req, res) => {
        try {
            const { order_detail_id } = req.params;
            const {
                quantity,
                total_harga_food
            } = req.body;
            const updated =
                await orderDetailRepo.updateOrderItemQuantity(
                    order_detail_id,
                    quantity,
                    total_harga_food
                );
            res.status(200).json({
                success: true,
                message: 'Successfully updated order item',
                data: updated
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    },

    deleteOrderItem: async (req, res) => {
        try {
            const { order_detail_id } = req.params;
            const deleted =
                await orderDetailRepo.deleteOrderItem(
                    order_detail_id
                );
            res.status(200).json({
                success: true,
                message: 'Successfully deleted order item',
                data: deleted
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
                data: null
            });
        }
    }
};

module.exports = orderDetailController;