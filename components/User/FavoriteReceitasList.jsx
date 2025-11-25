import React, { useState, useCallback } from 'react';
import { ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { getFavoriteReceitas } from '../../services/FavoriteService';
import { getAuthenticatedUser } from '../../services/UserService';
import ReceitasList from '../Receitas/ReceitasList';
import { useTheme } from '../../services/ThemeContext';

const Container = styled.View`
  flex: 1;
`;

const EmptyText = styled.Text`
  color: ${props => props.theme.textSecondary};
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
`;

const FavoriteReceitasList = () => {
  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { colors } = useTheme();

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const user = await getAuthenticatedUser();
      if (user) {
        // Assumindo que existe um endpoint ou filtro para favoritos
        // Se não existir, precisaremos filtrar no front ou criar no back
        // Por enquanto, vamos usar uma função hipotética ou a mesma de listagem se ela suportar filtro
        const data = await getFavoriteReceitas(user.id);
        setReceitas(data);
      }
    } catch (error) {
      console.error('Falha ao carregar receitas favoritas:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />;
  }

  return (
    <Container>
      {receitas.length === 0 ? (
        <EmptyText>Você ainda não tem receitas favoritas.</EmptyText>
      ) : (
        <ReceitasList receitas={receitas} scrollEnabled={false} />
      )}
    </Container>
  );
};

export default FavoriteReceitasList;