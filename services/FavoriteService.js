import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthenticatedUser } from './UserService';

const FAVORITES_KEY_PREFIX = '@favorite_recipes_user_';

// Função para obter a chave de armazenamento específica do usuário
const getUserFavoritesKey = async () => {
    const user = await getAuthenticatedUser();
    if (!user || !user.id) {
        console.error("Usuário não autenticado. Não é possível acessar os favoritos.");
        return null;
    }
    return `${FAVORITES_KEY_PREFIX}${user.id}`;
};

// Função auxiliar para buscar todos os favoritos
const getFavorites = async () => {
    try {
        const userKey = await getUserFavoritesKey();
        if (!userKey) return [];

        const favoritesJson = await AsyncStorage.getItem(userKey);
        return favoritesJson ? JSON.parse(favoritesJson) : [];
    } catch (e) {
        console.error("Erro ao buscar favoritos do AsyncStorage", e);
        return [];
    }
};

// Adiciona uma receita aos favoritos
export const addFavorite = async (receita) => {
    try {
        const userKey = await getUserFavoritesKey();
        if (!userKey) return;

        const favorites = await getFavorites();
        // Evita adicionar duplicatas
        if (!favorites.some(fav => fav.id === receita.id)) {
            const newFavorites = [...favorites, receita];
            await AsyncStorage.setItem(userKey, JSON.stringify(newFavorites));
        }
    } catch (e) {
        console.error("Erro ao adicionar favorito", e);
    }
};

// Remove uma receita dos favoritos
export const removeFavorite = async (receitaId) => {
    try {
        const userKey = await getUserFavoritesKey();
        if (!userKey) return;

        const favorites = await getFavorites();
        const newFavorites = favorites.filter(fav => fav.id !== receitaId);
        await AsyncStorage.setItem(userKey, JSON.stringify(newFavorites));
    } catch (e) {
        console.error("Erro ao remover favorito", e);
    }
};

// Verifica se uma receita específica é favorita
export const isFavorite = async (receitaId) => {
    const favorites = await getFavorites();
    return favorites.some(fav => fav.id === receitaId);
};

// Retorna a lista completa de receitas favoritas
export const getFavoriteReceitas = async () => {
    return await getFavorites();
};