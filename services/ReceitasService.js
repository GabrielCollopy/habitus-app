import api from "../api";

export async function getReceitas() {
    try {
        const response = await api.get(`/api/private/receita`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar receitas:", error);
        throw error;
    }
}

export async function getReceitasByUser(userId){
    try {
        const response = await api.get(`/api/private/receita/byUser/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar receitas por usuário:", error);
        throw error;
    }
}

export async function getReceitaById(receitaId) {
    try{ 
        const response = await api.get(`/api/private/receita/${receitaId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar receita por ID:", error);
        throw error;
    }
}

export async function postReceita(receita) {
    try {
        const response = await api.post(`/api/private/receita`, receita);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar receita:", error);
        throw error;
    }
}

export async function updateReceita(receitaId, receita) {
    try {
        const id = Number(receitaId);
        const response = await api.put(`/api/private/receita/${id}`, receita);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar receita:", error);
        throw error;
    }
}

export async function deleteReceita(receitaId) {
    try {
        const response = await api.delete(`/api/private/receita/delete/${receitaId}`);
    } catch (error) {
        console.error("Erro ao deletar receita:", error);
        throw error;
    }
}

export async function searchReceitasByName(name) {
    try {
        const response = await api.get(`api/private/receita/searchByName`, {
            params: { name },
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar receitas por nome:", error);
        throw error;
    }
}