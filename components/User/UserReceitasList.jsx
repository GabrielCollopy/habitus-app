import React, { useState, useCallback } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';
import { getReceitasByUser, deleteReceita } from '../../services/ReceitasService'; // Service das receitas
import { getAuthenticatedUser } from '../../services/UserService'; // Service do usuário

const Container = styled.View`
  flex: 1;
  margin-top: 20px;
`;

const ReceitaItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${COLORS.cardBackground};
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
`;

const MainContent = styled.View`
  flex: 1;
`;

const ReceitaTitle = styled.Text`
  color: ${COLORS.textLight};
  font-size: 17px;
  font-weight: bold;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center; /* Alinha os ícones verticalmente */
`;

const EmptyText = styled.Text`
  color: ${COLORS.textSecondary};
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
`;

const UserReceitasList = () => {
  const [receitas, setReceitas] = useState([]);
  const navigation = useNavigation();

  const loadReceitas = async () => {
    try {
      // 1. Obter o usuário autenticado para pegar seu ID
      const user = await getAuthenticatedUser();
      // 2. Passar o ID do usuário para a função de busca
      const data = await getReceitasByUser(user.id);
      setReceitas(data);
    } catch (error) {
      console.error('Falha ao carregar as receitas do usuário:', error);
      Alert.alert("Erro", "Não foi possível carregar suas receitas.");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReceitas();
    }, [])
  );

  const handleDelete = (id) => {
    Alert.alert("Confirmar Exclusão", "Deseja realmente excluir esta receita?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteReceita(id);
            setReceitas(prev => prev.filter(r => r.id !== id));
            Alert.alert('Sucesso', 'Receita excluída!');
          } catch (error) {
            console.error('Falha ao deletar receita:', error);
          }
        },
      },
    ]);
  };

  const handleEdit = (item) => {
    // Correção para o erro de navegação:
    // Navega para o Stack que contém o formulário e passa a tela e os parâmetros desejados.
    // Isso ajuda o React Navigation a encontrar o caminho correto entre diferentes stacks (ex: de uma aba para outra).
    // Assumindo que 'Receitas' é o nome da rota no seu navegador principal que leva ao ReceitasStack.
    navigation.navigate('Receitas', { screen: 'ReceitasForm', params: { receita: item } });
  };

  const renderItem = ({ item }) => (
    <ReceitaItem>
      {/* Conteúdo principal com o título da receita */}
      <MainContent>
        <ReceitaTitle>{item.nome}</ReceitaTitle>
      </MainContent>

      {/* Botões de ação (editar e excluir) */}
      <ActionsContainer>
        <TouchableOpacity onPress={() => handleEdit(item)}><Ionicons name="create-outline" size={22} color={COLORS.accent} /></TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 20 }}><Ionicons name="trash-outline" size={22} color={COLORS.danger} /></TouchableOpacity>
      </ActionsContainer>
    </ReceitaItem>
  );

  return (
    <Container>
      {receitas.length === 0 ? (
        <EmptyText>Você ainda não cadastrou nenhuma receita.</EmptyText>
      ) : (
        // Correção para o erro de VirtualizedList:
        // Removemos a FlatList e mapeamos os itens diretamente.
        // A rolagem já é fornecida pelo KeyboardAwareScrollView na UserScreen.
        receitas.map(item => (
          <View key={item.id.toString()}>{renderItem({ item })}</View>
        ))
      )}
    </Container>
  );
};

export default UserReceitasList;