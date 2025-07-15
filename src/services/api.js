import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
};

export const queueAPI = {
  getQueues: () => api.get('/queues'),
  createQueue: (queueData) => api.post('/queues', queueData),
  joinQueue: (data) => api.post('/join-queue', data),
  leaveQueue: (userId) => api.delete(`/leave-queue/${userId}`),
  getUserQueue: (userId) => api.get(`/user-queue/${userId}`),
  processNext: (queueId) => api.post(`/process-next/${queueId}`),
};

export default api;