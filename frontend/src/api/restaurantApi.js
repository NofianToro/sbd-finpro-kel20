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
        `/restaurants/restaurant/${username}`
    );

    return response.data;
};
export const updateRestaurantImage = async ( restaurant_id,url_img) => {
    const response = await api.put(
        `/restaurants/profile/image/${restaurant_id}`,
        { url_img }
    );
    return response.data;
};