import api, { API_BASE_URL } from "../api";

export async function getAuthenticatedUser() {
    try {
        const response = await api.get(`/api/auth/me`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar usuário autenticado:", error);
        throw error;
    }
}

export async function createUser(user) {
    try {
        const response = await api.post(`/api/public/user`, user);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw error;
    }
}

export async function updateUser(userId, user) {
    try {
        const response = await api.put(`/api/public/user/${userId}`, user);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        throw error;
    }
}

export async function deleteUser(userId) {
    try {
        const response = await api.delete(`${API_BASE_URL}/api/user/${userId}`);
    }
    catch (error) {
        console.error("Erro ao deletar usuário:", error);
        throw error;
    }
}