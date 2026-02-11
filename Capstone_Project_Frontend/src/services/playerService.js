import API from './api';

export const getPlayers = async () => {
    const response = await API.get('/players');
    return response.data;
};

export const createPlayer = async (playerData) => {
    const response = await API.post('/players', playerData);
    return response.data;
};

export const updatePlayer = async (id, playerData) => {
    const response = await API.put(`/players/${id}`, playerData);
    return response.data;
};

export const deletePlayer = async (id) => {
    const response = await API.delete(`/players/${id}`);
    return response.data;
};
