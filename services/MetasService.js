import { Alert } from "react-native";
import { API_BASE_URL } from "../api";
import axios from "axios";

export async function getMetas() {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/public/meta`);
        return response.data;
    } catch (error) {
        Alert.alert("Erro", "Erro ao buscar metas.");
        throw error;
    }
}

export async function createMeta(meta) {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/public/meta`, meta);
        return response.data;
    } catch (error) {
        Alert.alert("Erro", "Erro ao criar meta.");
        throw error;
    }
}

export async function deleteMeta(id) {
    try {
        await axios.delete(`${API_BASE_URL}/api/public/meta/${id}`);
    } catch (error) {
        Alert.alert("Erro", "Erro ao deletar meta.");
        throw error;
    }
}

export async function updateMeta(id, meta) {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/public/meta/${id}`, meta);
        return response.data;
    } catch (error) {
        Alert.alert("Erro", "Erro ao atualizar meta.");
        throw error;
    }
}



