import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, SafeAreaView, TextInput } from 'react-native';
import styled from 'styled-components/native';
import { getReceitas, deleteReceita, searchReceitasByName } from '../../services/ReceitasService';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import ReceitasCard from './ReceitasCard';
import ReceitaDetalhesModal from './ReceitaDetalhesModal';
import { useTheme } from '../../services/ThemeContext';
import CustomButton from '../Global/CustomButton';

const ListContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 10px;
`;

const NoDataText = styled.Text`
    color: ${props => props.theme.textLight};
    text-align: center;
    margin-top: 50px;
    font-size: 16px;
`;

const LoadingContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.theme.background};
`;

export default function ReceitasList({ searchTerm, scrollEnabled = true, receitas: externalReceitas }) {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { colors } = useTheme();

  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReceita, setSelectedReceita] = useState(null);


  const loadData = async () => {
    if (externalReceitas) {
      setReceitas(externalReceitas);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      let data;
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
    if (isFocused || externalReceitas) {
      loadData();
    }
  }, [isFocused, searchTerm, externalReceitas]);

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

  const handleCardPress = (item) => {
    setSelectedReceita(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedReceita(null);
  };
  if (loading) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" color={colors.primary} />
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
            onPress={() => handleCardPress(item)}
          />
        )}
        scrollEnabled={scrollEnabled}
      />
      <ReceitaDetalhesModal
        visible={modalVisible}
        receita={selectedReceita}
        onClose={handleCloseModal}
      />
    </ListContainer>
  );
}
