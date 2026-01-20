import API from './api';

export const login = async (email, password) => {
    const response = await API.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
    }
    return response.data;
};

export const signup = async (userData) => {
    const response = await API.post('/auth/signup', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', response.data.role);
    }
    return response.data;
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
};

export const getCurrentUser = async () => {
    try {
        const response = await API.get('/auth/profile');
        return response.data;
    } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        return null;
    }
};

export const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

export const getUserRole = () => {
    return localStorage.getItem('role');
};
