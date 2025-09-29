import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, SafeAreaView } from 'react-native';
import styled from 'styled-components/native';
import { getReceitas, deleteReceita } from '../../services/ReceitasService';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ReceitasCard from './ReceitasCard';
import { COLORS } from '../../constants/Colors';
import CustomButton from '../Global/CustomButton';

const ListContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${COLORS.background}; /* Fundo escuro do tema */
  padding: 10px;
`;

const NoDataText = styled.Text`
    color: ${COLORS.textLight};
    text-align: center;
    margin-top: 50px;
    font-size: 16px;
`;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${COLORS.background};
`;

export default function ReceitasList({ route }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReceitas = async () => {
    setLoading(true);
    try {
      const data = await getReceitas();
      setReceitas(data);
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
      Alert.alert("Erro", "Não foi possível carregar as receitas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchReceitas();
    }
  }, [isFocused]);

  const handleDelete = (id) => {
    Alert.alert(
      "Confirmação",
      "Você tem certeza que deseja deletar esta receita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReceita(id);
              setReceitas(prev => prev.filter(r => r.id !== id));
            } catch (error) {
              console.error("Erro ao deletar receita:", error);
              Alert.alert("Erro", "Não foi possível deletar a receita.");
            }
          }
        }
      ]
    );
  };

  const handleEdit = (item) => {
    navigation.navigate('ReceitasFormScreen', { receita: item });
  }

  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </LoadingContainer>
    );
  }

  if (receitas.length === 0) {
    return (
      <ListContainer>
        <NoDataText>Nenhuma receita encontrada. Adicione uma nova receita!</NoDataText>
      </ListContainer>
    );
  }

  return (
    <ListContainer>
      <FlatList
        data={receitas}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <ReceitasCard
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      />
    </ListContainer>
  );
}
