import api from './axios';

// user side
export const createOrder = async (orderData) => {
    const response = await api.post(
        '/users/orders',
        orderData
    );

    return response.data;
};

export const addOrderItem = async (itemData) => {
    const response = await api.post(
        '/users/orders/items',
        itemData
    );

    return response.data;
};

export const getMyOrders = async () => {
    const response = await api.get(
        '/users/orders'
    );

    return response.data;
};

export const getOrderById = async (order_id) => {
    const response = await api.get(
        `/users/orders/${order_id}`
    );

    return response.data;
};

export const getOrderItems = async (order_id) => {
    const response = await api.get(
        `/users/orders/${order_id}/items`
    );

    return response.data;
};

// resto side

export const getRestaurantOrders = async () => {
    const response = await api.get(
        '/restaurants/orders'
    );

    return response.data;
};

export const updateOrderStatus = async (order_id,order_status)=> {
    const response = await api.put(
        `/restaurants/orders/${order_id}/status`,
        { order_status }
    );
    return response.data;
};