import { API_BASE_URL } from "../api";
import api from "../api";

export async function getReceitas() {
    try {
        const response = await api.get(`${API_BASE_URL}/api/receita`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar receitas:", error);
        throw error;
    }
}

export async function getReceitaById(receitaId) {
    try{ 
        const response = await api.get(`${API_BASE_URL}/api/receita/${receitaId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar receita por ID:", error);
        throw error;
    }
}

export async function postReceita(receita) {
    try {
        const response = await api.post(`${API_BASE_URL}/api/receita`, receita);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar receita:", error);
        throw error;
    }
}

export async function updateReceita(receitaId, receita) {
    try {
        const id = Number(receitaId);
        const response = await api.put(`${API_BASE_URL}/api/receita/${id}`, receita);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar receita:", error);
        throw error;
    }
}

export async function deleteReceita(receitaId) {
    try {
        const response = await api.delete(`${API_BASE_URL}/api/receita/${receitaId}`);
    } catch (error) {
        console.error("Erro ao deletar receita:", error);
        throw error;
    }
}