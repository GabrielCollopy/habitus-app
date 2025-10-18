import axios from 'axios';

export const API_BASE_URL = 'http://192.168.18.11:8080'; 


const api = axios.create({
  baseURL: API_BASE_URL,
});


export default api;