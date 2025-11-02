import api from "../api";

export async function getAllIngredientes() {
    try {
        const response = await api.get(`/api/public/ingrediente`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar ingredientes:", error);
        throw error;
    }
}

export async function getIngredienteByName(name) {
    try {
        const response = await api.get(`api/public/ingrediente/${name}`);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar ingrediente por nome:", error);
        throw error;
    }
}

export async function postIngrediente(ingrediente) {
    try {
        const response = await api.post(`/api/public/ingrediente`, ingrediente);
        return response.data;
    } catch (error) {
        console.error("Erro ao criar ingrediente:", error);
        throw error;
    }
}