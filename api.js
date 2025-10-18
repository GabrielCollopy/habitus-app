import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from 'base-64'; // Importe a função de codificação

export const API_BASE_URL = 'http://192.168.18.11:8080'; // Ajustar para seu IP local

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Adiciona um interceptor para incluir o token de autorização em todas as requisições
/*api.interceptors.request.use(async (config) => {
  const userToken = await AsyncStorage.getItem('userToken');
  if (userToken) {
    config.headers.Authorization = `Basic ${userToken}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});*/

export default api;