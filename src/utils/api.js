import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vaultx_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired tokens
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('vaultx_token');
      localStorage.removeItem('vaultx_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

export const userAPI = {
  getDashboard: () => api.get('/user/dashboard'),
  getTransactions: () => api.get('/user/transactions'),
  deposit: (data) => api.post('/user/deposit', data),
  withdraw: (data) => api.post('/user/withdraw', data),
  spin: () => api.post('/user/spin'),
  completeTask: (data) => api.post('/user/task', data),
  getLeaderboard: () => api.get('/user/leaderboard'),
  selectPlan: (data) => api.post('/user/plan', data),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  getTransactions: () => api.get('/admin/transactions'),
  getPendingDeposits: () => api.get('/admin/deposits/pending'),
  getPendingWithdrawals: () => api.get('/admin/withdrawals/pending'),
  approveDeposit: (id) => api.post(`/admin/deposits/approve/${id}`),
  rejectDeposit: (id, reason) => api.post(`/admin/deposits/reject/${id}`, { reason }),
  approveWithdrawal: (id) => api.post(`/admin/withdrawals/approve/${id}`),
  rejectWithdrawal: (id, reason) => api.post(`/admin/withdrawals/reject/${id}`, { reason }),
  banUser: (id) => api.post(`/admin/users/ban/${id}`),
};

export default api;