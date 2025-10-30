import { Alert } from "react-native";
import api from "../api";

export async function getMetas(userId) {
    try {
        const response = await api.get(`/api/public/meta/${userId}`);
        return response.data;
    } catch (error) {
        Alert.alert("Erro", "Erro ao buscar metas.");
        throw error;
    }
}

export async function createMeta(meta) {
    try {
        const response = await api.post(`/api/public/meta`, meta);
        return response.data;
    } catch (error) {
        Alert.alert("Erro", "Erro ao criar meta.");
        throw error;
    }
}

export async function deleteMeta(id) {
    try {
        await api.delete(`/api/public/meta/${id}`);
    } catch (error) {
        Alert.alert("Erro", "Erro ao deletar meta.");
        throw error;
    }
}

export async function updateMeta(id, meta) {
    try {
        const response = await api.put(`/api/public/meta/${id}`, meta);
        return response.data;
    } catch (error) {
        Alert.alert("Erro", "Erro ao atualizar meta.");
        throw error;
    }
}



