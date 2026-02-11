import API from './api';

export const getTeams = async () => {
    const response = await API.get('/teams');
    return response.data;
};

export const createTeam = async (teamData) => {
    const response = await API.post('/teams', teamData);
    return response.data;
};

export const updateTeam = async (id, teamData) => {
    const response = await API.put(`/teams/${id}`, teamData);
    return response.data;
};

export const deleteTeam = async (id) => {
    const response = await API.delete(`/teams/${id}`);
    return response.data;
};
