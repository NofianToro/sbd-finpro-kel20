import api from './axios';
export const addFavorite = async (food_id) => {
    const response = await api.post(
        `/users/favorites/${food_id}`
    );

    return response.data;
};

export const removeFavorite = async (food_id) => {
    const response = await api.delete(
        `/users/favorites/${food_id}`
    );

    return response.data;
};

export const getMyFavorites = async () => {
    const response = await api.get(
        '/users/favorites'
    );

    return response.data;
};