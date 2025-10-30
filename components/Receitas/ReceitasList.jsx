import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, SafeAreaView, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { getReceitas, deleteReceita, searchReceitasByName } from '../../services/ReceitasService';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ReceitasCard from './ReceitasCard';
import ReceitaDetalhesModal from './ReceitaDetalhesModal'; // 1. Importar o modal
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

export default function ReceitasList({ searchTerm }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  // 2. Adicionar estados para controlar o modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReceita, setSelectedReceita] = useState(null);


  const loadData = async () => {
    setLoading(true);
    try {
      let data;
      // Se houver um termo de busca, usa a função de pesquisa.
      // Caso contrário, busca todas as receitas.
      if (searchTerm && searchTerm.trim() !== '') {
        data = await searchReceitasByName(searchTerm);
      } else {
        data = await getReceitas();
      }
      setReceitas(data);
    } catch (error) {
      console.error("Erro ao buscar receitas:", error);
      Alert.alert("Erro", "Não foi possível carregar as receitas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // A busca é acionada quando a tela ganha foco OU quando o termo de busca muda.
    if (isFocused) { 
      loadData();
    }
  }, [isFocused, searchTerm]);

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
    navigation.navigate('ReceitasForm', { receita: item });
  }

  // 3. Adicionar função para abrir o modal
  const handleCardPress = (item) => {
    setSelectedReceita(item);
    setModalVisible(true);
  };

  // 4. Adicionar função para fechar o modal
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReceita(null);
  };
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
            onPress={() => handleCardPress(item)} // 5. Passar a função de clique para o card
            // onEdit={() => handleEdit(item)} // Estas funções podem ser movidas para o modal depois
            // onDelete={() => handleDelete(item.id)}
          />
        )}
      />
      {/* 6. Renderizar o modal */}
      <ReceitaDetalhesModal
        visible={modalVisible}
        receita={selectedReceita}
        onClose={handleCloseModal}
      />
    </ListContainer>
  );
}
