const billRepo = require('../repositories/billRepository');

const billController = {

    createBill: async (req, res) => {
        const {
            order_id,
            total_amount,
            platform_fee
        } = req.body;

        if (!order_id || !total_amount) {
            return res.status(400).json({
                success: false,
                message: 'Required fields are missing',
                data: null
            });
        }

        try {
            const bill = await billRepo.createBill({
                order_id,
                total_amount,
                platform_fee
            });

            res.status(201).json({
                success: true,
                message: 'Successfully created bill',
                data: bill
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

module.exports = billController;