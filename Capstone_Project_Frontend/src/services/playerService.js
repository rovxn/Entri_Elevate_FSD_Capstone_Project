import API from './api';

export const getPlayers = async () => {
    const response = await API.get('/players');
    return response.data;
};

export const createPlayer = async (playerData) => {
    const response = await API.post('/players', playerData);
    return response.data;
};
