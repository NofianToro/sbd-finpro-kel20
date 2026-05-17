const db = require('../database/db');

const billRepository = {

    createBill: async (billData) => {
        const {
            order_id,
            total_amount,
            platform_fee
        } = billData;

        const query = `
            INSERT INTO bills
            (order_id, total_amount, platform_fee)
            VALUES ($1, $2, $3)
            RETURNING *;
        `;

        const values = [order_id, total_amount, platform_fee];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    getBillByOrderId: async (order_id) => {
        const query = `SELECT * FROM bills WHERE order_id = $1;`;

        try {
            const result = await db.query(query, [order_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
    updateBill: async (
        order_id,
        total_amount,
        platform_fee
    ) => {
        const query = `
            UPDATE bills
            SET
                total_amount = $1,
                platform_fee = $2
            WHERE order_id = $3
            RETURNING *;
        `;
        try {
            const result =
                await db.query(query,[total_amount, platform_fee, order_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }
};

module.exports = billRepository;