import api from './axios';

export const createReview = async (reviewData) => {
    const response = await api.post('/users/reviews', reviewData);
    return response.data;
};

// user-side review fetch
export const getFoodReviews = async (food_id) => {
    const response = await api.get(`/users/reviews/food/${food_id}`);
    return response.data;
};

// public — works from both user and partner pages
export const getRestaurantFoodReviews = async (food_id) => {
    const response = await api.get(`/restaurants/reviews/food/${food_id}`);
    return response.data;
};