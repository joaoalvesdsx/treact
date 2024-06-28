// src/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://backend-5eid.onrender.com', // Use a variável de ambiente para a URL da API
  timeout: 10000, // Configuração opcional de timeout
  headers: {
    'Content-Type': 'application/json',
    // Outros headers comuns, se necessário
  },
});

export default api;
