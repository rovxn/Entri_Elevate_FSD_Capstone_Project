import API from './api';

export const getMatches = async () => {
    const response = await API.get('/matches');
    return response.data;
};

export const createMatch = async (matchData) => {
    const response = await API.post('/matches', matchData);
    return response.data;
};

export const updateMatchScore = async (id, scoreData) => {
    const response = await API.put(`/matches/${id}/score`, scoreData);
    return response.data;
};
