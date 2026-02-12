import API from './api';

export const getTopScorers = async () => {
    const response = await API.get('/analytics/top-scorers');
    return response.data;
};

export const getTopWicketTakers = async () => {
    const response = await API.get('/analytics/top-wicket-takers');
    return response.data;
};

export const getPlatformOverview = async () => {
    const response = await API.get('/analytics/overview');
    return response.data;
};
