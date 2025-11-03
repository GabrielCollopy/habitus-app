import React, { useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { COLORS } from '../../constants/Colors';
import { getFavoriteReceitas } from '../../services/FavoriteService';
import ReceitasCard from '../Receitas/ReceitasCard'; // Reutilizaremos o card

const Container = styled.View`
    flex: 1;
`;

const EmptyText = styled.Text`
  color: ${COLORS.textSecondary};
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
`;

const FavoriteReceitasList = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        setLoading(true);
        const data = await getFavoriteReceitas();
        setFavorites(data);
        setLoading(false);
      };
      loadFavorites();
    }, [])
  );

  const handleCardPress = (item) => {
    // Navega para a tela de detalhes, que já existe no seu app
    navigation.navigate('Receitas', { screen: 'ReceitaDetalhes', params: { receita: item } });
  };

  if (loading) {
    return <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />;
  }

  return (
    <Container>
      {favorites.length === 0 ? (
        <EmptyText>Você ainda não marcou nenhuma receita como favorita.</EmptyText>
      ) : (
        favorites.map(item => <ReceitasCard key={item.id} item={item} onPress={() => handleCardPress(item)} />)
      )}
    </Container>
  );
};

export default FavoriteReceitasList;