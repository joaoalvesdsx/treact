// src/setupAxios.js
import axios from 'axios';

const token = localStorage.getItem('token');

if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
