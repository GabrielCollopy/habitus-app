import axios from 'axios';

export const API_BASE_URL = 'http://10.254.212.18:8080';


const api = axios.create({
  baseURL: API_BASE_URL,
});


export default api;