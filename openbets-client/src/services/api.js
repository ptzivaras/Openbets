import axios from 'axios';

const API_BASE_URL = 'http://localhost:5043/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const winningColumnsApi = {
  getAll: (gameId = null, page = 1, pageSize = 20) => {
    const params = new URLSearchParams({ page, pageSize });
    if (gameId) params.append('gameId', gameId);
    return api.get(`/WinningColumns?${params}`);
  },

  getLatest: (gameId = 5104) => {
    return api.get(`/WinningColumns/latest?gameId=${gameId}`);
  },

  getById: (id) => {
    return api.get(`/WinningColumns/${id}`);
  },

  create: (data) => {
    return api.post('/WinningColumns', data);
  },
};

export const healthApi = {
  check: () => api.get('/Health'),
};

export default api;
