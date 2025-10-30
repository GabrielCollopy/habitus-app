import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api'; // Certifique-se que o caminho para sua instância do axios está correto
import { encode } from 'base-64';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(null); // null = verificando, false = deslogado, true = logado

    useEffect(() => {
        // Verifica o token no AsyncStorage ao iniciar o app
        const initializeAuth = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) {
                api.defaults.headers.common['Authorization'] = `Basic ${token}`;
                setIsUserLoggedIn(true);
            } else {
                setIsUserLoggedIn(false);
            }
        };
        initializeAuth();
    }, []);

    const login = async (username, password) => {
        try {
            const token = encode(`${username}:${password}`);
            // Faz uma chamada para validar as credenciais
            await api.get(`/api/auth/me`, {
                headers: { Authorization: `Basic ${token}` },
            });
            await AsyncStorage.setItem('userToken', token);
            api.defaults.headers.common['Authorization'] = `Basic ${token}`;
            setIsUserLoggedIn(true); // <<-- A MÁGICA ACONTECE AQUI! O estado global muda.
        } catch (error) {
            console.error("Erro no login via AuthContext:", error);
            throw error; // Lança o erro para a tela de login tratar (ex: mostrar alerta)
        }
    };

    const logout = async () => {
        await AsyncStorage.removeItem('userToken');
        delete api.defaults.headers.common['Authorization'];
        setIsUserLoggedIn(false); // <<-- O estado global muda novamente.
    };

    return (
        <AuthContext.Provider value={{ isUserLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto em outros componentes
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};