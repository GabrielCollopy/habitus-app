import api from "../api";

export async function createComentario(comentario) {
    try {
        const response = await api.post("/api/private/comentario", comentario);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar comentario:", error);
        throw error;
    }
}

export async function getComentariosByReceita(receitaId) {
    try {
        const response = await api.get(`/api/private/comentario/byReceita/${receitaId}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar comentarios por receita:", error);
        throw error;
    }
}