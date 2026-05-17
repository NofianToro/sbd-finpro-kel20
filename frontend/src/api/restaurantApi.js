import api from './axios';

export const registerRestaurant = async (restaurantData) => {
    const response = await api.post(
        '/restaurants/register',
        restaurantData
    );
    return response.data;
};

export const loginRestaurant = async (restaurantData) => {
    const response = await api.post(
        '/restaurants/login',
        restaurantData
    );
    return response.data;
};

export const getAllRestaurants = async () => {
    const response = await api.get(
        '/restaurants'
    );
    return response.data;
};

export const getRestaurantByUsername = async (username) => {
    const response = await api.get(
        `/restaurants/${username}`
    );

    return response.data;
};