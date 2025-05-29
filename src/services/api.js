// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gremioagenorback-1.onrender.com/', // ou a URL da sua API
});

export default api;
