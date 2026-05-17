const db = require("../database/db");

const orderDetailRepository = {
    createOrderDetail: async (detailData) => {
        const { order_id, food_id, quantity, total_harga_food } = detailData;

        const query = `
            INSERT INTO order_detail
            (order_id, food_id, quantity, total_harga_food)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;

        const values = [order_id, food_id, quantity, total_harga_food];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    getOrderDetailByOrderId: async (order_id) => {
        const query = `
            SELECT od.*, f.food_name
            FROM order_detail od
            JOIN food f ON od.food_id = f.food_id
            WHERE od.order_id = $1;
        `;

        try {
            const result = await db.query(query, [order_id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = orderDetailRepository;
