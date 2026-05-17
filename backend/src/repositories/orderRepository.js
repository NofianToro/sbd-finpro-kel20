const db = require("../database/db");

const orderRepository = {
  createFullOrder: async (orderData, orderItems) => {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const headerQuery = `
                INSERT INTO order_header (user_id, restaurant_id, order_amount, order_status, location)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING order_id;
            `;
      const headerValues = [
        orderData.user_id,
        orderData.restaurant_id,
        orderData.order_amount,
        "ordered",
        orderData.location,
      ];

      const headerResult = await client.query(headerQuery, headerValues);
      const newOrderId = headerResult.rows[0].order_id;

      const detailQuery = `
                INSERT INTO order_detail (order_id, food_id, quantity, total_harga_food)
                VALUES ($1, $2, $3, $4);
            `;

      for (let item of orderItems) {
        await client.query(detailQuery, [
          newOrderId,
          item.food_id,
          item.quantity,
          item.total_harga_food,
        ]);
      }

      await client.query("COMMIT");
      return newOrderId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  getUserHistory: async (userId) => {
    const query = `
            SELECT * FROM order_header
            WHERE user_id = $1 AND order_status = 'done'
            ORDER BY order_date DESC;
        `;
    try {
      const result = await db.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  getOrdersByrestaurantId: async (restaurantId) => {
    const query = `
              SELECT o.order_id, o.order_date, o.order_amount, o.order_status, o.location, u.display_name as user_name
              FROM order_header o
              JOIN master_user u ON o.user_id = u.user_id
              WHERE o.restaurant_id = $1
              ORDER BY o.order_date DESC;
          `;
    try {
      const result = await db.query(query, [restaurantId]);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    const query = `
              UPDATE order_header
              SET order_status = $1
              WHERE order_id = $2
              RETURNING order_id, order_status;
          `;
    try {
      const result = await db.query(query, [newStatus, orderId]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = orderRepository;
