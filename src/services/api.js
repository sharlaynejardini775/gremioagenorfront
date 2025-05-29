// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://gremioagenorback.onrender.com/', // ou a URL da sua API
});

export default api;
