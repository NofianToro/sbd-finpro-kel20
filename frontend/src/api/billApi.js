import api from './axios';

// user side

export const getBillByOrderId = async (order_id) => {
    const response = await api.get(
        `/users/orders/${order_id}/bill`
    );

    return response.data;
};

// restaurant side
export const createBill = async (order_id, billData) => {
    const response = await api.post(
        `/users/orders/${order_id}/bill`,
        billData
    );

    return response.data;
};

export const updateBill = async (order_id,billData) => {
    const response = await api.put(
        `/restaurants/orders/${order_id}/bill`,
        billData
    );

    return response.data;
};