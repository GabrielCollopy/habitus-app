import React, { useState, useCallback } from 'react';
import { FlatList, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
// Importe as funções do seu service
import { getMetas, deleteMeta } from '../../services/MetasService'; // Ajuste o caminho se necessário
import { getAuthenticatedUser } from '../../services/UserService';
import { useTheme } from '../../services/ThemeContext';

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 0 16px;
`;

const MetaItem = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 8px;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid ${props => props.theme.border || 'transparent'};
`;

const MetaContent = styled.View`
  flex: 1;
`;

const MetaTitle = styled.Text`
  color: ${props => props.theme.textLight};
  font-size: 18px;
  font-weight: bold;
`;

const MetaDescription = styled.Text`
  color: ${props => props.theme.textSecondary};
  font-size: 14px;
  margin: 4px 0;
`;

const MetaStatus = styled.Text`
  color: ${props => props.theme.accent};
  font-weight: bold;
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

const MetasList = () => { // Removido refreshTrigger, pois usaremos useFocusEffect
  const [metas, setMetas] = useState([]);
  const navigation = useNavigation();
  const { colors } = useTheme();

  const loadMetas = async () => {
    try {
      const user = await getAuthenticatedUser();
      const userId = user.id;
      const data = await getMetas(userId);
      setMetas(data);
    } catch (error) {
      // O service já exibe um alerta de erro.
      console.error('Falha ao carregar metas:', error);
    }
  };

  // useFocusEffect é chamado toda vez que a tela entra em foco
  useFocusEffect(
    useCallback(() => {
      loadMetas();
    }, [])
  );

  const handleDelete = async (id) => {
    try {
      await deleteMeta(id);
      // Atualiza a lista na tela removendo o item deletado, para um feedback instantâneo
      setMetas(prevMetas => prevMetas.filter(meta => meta.id !== id));
      Alert.alert('Sucesso', 'A meta foi excluída!');
    } catch (error) {
      console.error('Falha ao deletar meta:', error);
    }
  };

  // Navega para a tela de formulário passando o objeto completo da meta
  const handleEdit = (item) => {
    navigation.navigate('MetaForm', { meta: item });
  };

  const renderItem = ({ item }) => (
    <MetaItem>
      <MetaContent>
        <MetaTitle>{item.nome}</MetaTitle>
        <MetaDescription>{item.descricao}</MetaDescription>
        <MetaStatus>Status: {item.status}</MetaStatus>
      </MetaContent>

      <ActionsContainer>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Ionicons name="create-outline" size={22} color={colors.accent} />
        </TouchableOpacity>
        {/* Adiciona margem para criar espaçamento, substituindo a propriedade 'gap' */}
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={{ marginLeft: 15 }}>
          <Ionicons name="trash-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </ActionsContainer>
    </MetaItem>
  );

  return (
    <Container>
      {metas.length === 0 ? (
        <EmptyText>Nenhuma meta encontrada. Adicione uma nova!</EmptyText>
      ) : (
        <FlatList
          data={metas}
          // Use o ID da meta como chave, que é único
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </Container>
  );
};

export default MetasList;