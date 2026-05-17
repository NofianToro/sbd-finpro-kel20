import api from './axios';

export const registerUser = async (userData) => {
    const response = await api.post(
        '/users/register',
        userData
    );
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post(
        '/users/login',
        userData
    );

    return response.data;
};

export const getUserProfile = async () => {
    const response = await api.get(
        '/users/profile'
    );
    return response.data;
};