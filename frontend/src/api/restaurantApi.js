import api from './axios';

const restaurantApi = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

export const registerRestaurant = async (restaurantData) => {
    const response = await api.post('/restaurants/register', restaurantData);
    return response.data;
};

export const loginRestaurant = async (restaurantData) => {
    const response = await api.post('/restaurants/login', restaurantData);
    return response.data;
};

export const getAllRestaurants = async () => {
    const response = await api.get('/restaurants');
    return response.data;
};

export const getRestaurantByUsername = async (username) => {
    const response = await api.get(`/restaurants/restaurant/${username}`);
    return response.data;
};

export const updateRestaurantImage = async (restaurant_id, url_img) => {
    const token = localStorage.getItem('restaurant_token');
    const response = await api.put(
        `/restaurants/profile/image/${restaurant_id}`,
        { url_img },
        restaurantApi(token)
    );
    return response.data;
};

export const getRestaurantOrders = async (restaurant_id) => {
    const token = localStorage.getItem('restaurant_token');
    const response = await api.get(
        `/restaurants/orders/all/${restaurant_id}`,
        restaurantApi(token)
    );
    return response.data;
};

export const updateOrderStatus = async (order_id, status) => {
    const token = localStorage.getItem('restaurant_token');
    const response = await api.put(
        `/restaurants/orders/${order_id}/status`,
        { order_status: status },
        restaurantApi(token)
    );
    return response.data;
};

export const getRestaurantOrderItems = async (order_id) => {
    const token = localStorage.getItem('restaurant_token');
    const response = await api.get(
        `/restaurants/orders/${order_id}/items`,
        restaurantApi(token)
    );
    return response.data;
};