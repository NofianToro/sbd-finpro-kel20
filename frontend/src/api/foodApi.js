import api from './axios';

const withRestaurantToken = () => {
    const token = localStorage.getItem('restaurant_token');
    return { headers: { Authorization: `Bearer ${token}` } };
};

// public
export const getAllFoods = async (search = '', category = '') => {
    const response = await api.get('/restaurants/foods', { params: { search, category } });
    return response.data;
};

export const getFoodById = async (food_id) => {
    const response = await api.get(`/restaurants/foods/${food_id}`);
    return response.data;
};

export const getFoodsByRestaurant = async (restaurant_id) => {
    const response = await api.get(`/restaurants/${restaurant_id}/foods`);
    return response.data;
};

// restaurant only (require restaurant_token)
export const createFood = async (foodData) => {
    console.log('createFood payload:', foodData);
    const response = await api.post('/restaurants/foods', foodData, withRestaurantToken());
    return response.data;
};

// use positive delta to add, negative to reduce stock
export const updateFoodStock = async (food_id, delta) => {
    const response = await api.put(
        `/restaurants/foods/${food_id}/stock`,
        { stockChange: delta },
        withRestaurantToken()
    );
    return response.data;
};