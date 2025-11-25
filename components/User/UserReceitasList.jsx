import React, { useState, useCallback } from 'react';
import { FlatList, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { getReceitasByUser, deleteReceita } from '../../services/ReceitasService';
import { getAuthenticatedUser } from '../../services/UserService';
import { useTheme } from '../../services/ThemeContext';

const Container = styled.View`
  flex: 1;
  padding: 0 16px;
`;

const ReceitaItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid ${props => props.theme.border || 'transparent'};
`;

const ReceitaContent = styled.View`
  flex: 1;
`;

const ReceitaTitle = styled.Text`
  color: ${props => props.theme.textLight};
  font-size: 18px;
  font-weight: bold;
`;

const ReceitaDescription = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  margin: 4px 0;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
`;

const EmptyText = styled.Text`
  color: ${props => props.theme.textSecondary};
  text-align: center;
  margin-top: 50px;
  font-size: 16px;
`;

const UserReceitasList = () => {
  const [receitas, setReceitas] = useState([]);
  const navigation = useNavigation();
  const { colors } = useTheme();

  const loadReceitas = async () => {
    try {
      const user = await getAuthenticatedUser();
      if (user) {
        const data = await getReceitasByUser(user.id);
        setReceitas(data);
      }
    } catch (error) {
      console.error('Falha ao carregar receitas:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadReceitas();
    }, [])
  );

  const handleDelete = async (id) => {
    Alert.alert(
      "Excluir Receita",
      "Tem certeza que deseja excluir esta receita?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteReceita(id);
              setReceitas(prev => prev.filter(item => item.id !== id));
              Alert.alert('Sucesso', 'Receita excluída!');
            } catch (error) {
              console.error('Falha ao deletar receita:', error);
              Alert.alert('Erro', 'Não foi possível excluir a receita.');
            }
          }
        }
      ]
    );
  };

  const handleEdit = (item) => {
    navigation.navigate('Receitas', {
      screen: 'ReceitasForm',
      params: { receita: item }
    });
  };

  const renderItem = ({ item }) => (
    <ReceitaItem>
      <ReceitaContent>
        <ReceitaTitle>{item.nome}</ReceitaTitle>
        <ReceitaDescription numberOfLines={1}>
          {item.ingredientes && Array.isArray(item.ingredientes)
            ? `${item.ingredientes.length} ingredientes`
            : 'Ver detalhes'}
        </ReceitaDescription>
      </ReceitaContent>

      <ActionsContainer>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Ionicons name="create-outline" size={22} color={colors.accent} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 20 }}>
          <Ionicons name="trash-outline" size={22} color={colors.danger} />
        </TouchableOpacity>
      </ActionsContainer>
    </ReceitaItem>
  );

  return (
    <Container>
      {receitas.length === 0 ? (
        <EmptyText>Você ainda não criou nenhuma receita.</EmptyText>
      ) : (
        <FlatList
          data={receitas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
        />
      )}
    </Container>
  );
};

export default UserReceitasList;