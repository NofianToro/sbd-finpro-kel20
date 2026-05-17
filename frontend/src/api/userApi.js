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


export const getAllUsers = async () => {
    const response = await api.get(
        '/users/getAll'
    );
    return response.data;
};

export const topUpSaldo = async (user_id, saldo) => {
    const response = await api.put(
        `/users/topUp/${user_id}`,
        { saldo }
    );
    return response.data;
};