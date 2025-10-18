import api, { API_BASE_URL } from '../api'; // Importe a instância centralizada
import AsyncStorage from '@react-native-async-storage/async-storage';
import { encode } from 'base-64';

export const login = async (username, password) => {
  try {
    const token = encode(`${username}:${password}`);

    // Valida as credenciais fazendo uma chamada a um endpoint protegido
    await api.get(`/api/auth/me`, {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    await AsyncStorage.setItem('userToken', token);
    api.defaults.headers.common['Authorization'] = `Basic ${token}`;
    console.log(username, password);
    return true;
  } catch (error) {
    console.error("Erro no login:", error);
    await AsyncStorage.removeItem('userToken');
    delete api.defaults.headers.common['Authorization'];
    console.log(username, password);
    throw error;
  }
};

export const logout = async () => {
  await AsyncStorage.removeItem('userToken');
  delete api.defaults.headers.common['Authorization'];
};

export const initializeAuth = async () => {
  const token = await AsyncStorage.getItem('userToken');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Basic ${token}`;
  }
  return token;
};