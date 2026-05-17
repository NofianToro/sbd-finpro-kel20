import api from './axios';

// public
export const getAllFoods = async (search = '', category = '') => {
    const response = await api.get(
        '/restaurants/foods',
        {
            params: {
                search,
                category
            }
        }
    );
    return response.data;
};

export const getFoodById = async (food_id) => {
    const response = await api.get(
        `/restaurants/foods/${food_id}`
    );
    return response.data;
};

export const getFoodsByRestaurant = async (restaurant_id) => {
    const response = await api.get(
        `/restaurants/${restaurant_id}/foods`
    );
    return response.data;
};


//restaurant only
export const createFood = async (foodData) => {
    const response = await api.post(
        '/restaurants/foods',
        foodData
    );
    return response.data;
};
//use + to add, - to reduce stock
export const updateFoodStock = async (food_id,foodData) => {
    const response = await api.put(
        `/restaurants/foods/${food_id}/stock`,
        foodData
    );

    return response.data;
};

// not implementing delete yet