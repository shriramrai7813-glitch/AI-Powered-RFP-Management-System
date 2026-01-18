// frontend/src/api.js
import axios from 'axios';

// Hardcode API URL to make sure it hits your backend correctly
const api = axios.create({
  baseURL: 'http://localhost:4000'
});

export default api;
