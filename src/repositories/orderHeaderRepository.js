const db = require("../database/db");

const orderHeaderRepository = {
    createOrderHeader: async (orderData) => {
        const { user_id, restaurant_id, order_amount, order_status, location } =
            orderData;

        const query = `
            INSERT INTO order_header
            (user_id, restaurant_id, order_amount, order_status, location)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;

        const values = [
            user_id,
            restaurant_id,
            order_amount,
            order_status,
            location,
        ];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    getAllOrderHeader: async () => {
        const query = `SELECT * FROM order_header ORDER BY order_id DESC;`;

        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },

    getOrderHeaderById: async (order_id) => {
        const query = `SELECT * FROM order_header WHERE order_id = $1;`;

        try {
            const result = await db.query(query, [order_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
};

module.exports = orderHeaderRepository;
