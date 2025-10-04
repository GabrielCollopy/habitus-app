import { API_BASE_URL } from "../api";
import axios from "axios";

export async function getUserById(userId) {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/public/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        throw error;
    }
}

export async function createUser(user) {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/public/user`, user);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw error;
    }
}

export async function deleteUser(userId) {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/user/${userId}`);
    }
    catch (error) {
        console.error("Erro ao deletar usuário:", error);
        throw error;
    }
}