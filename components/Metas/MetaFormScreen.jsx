import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import styled from 'styled-components/native';
import Button from '../Global/CustomButton';
import { createMeta, updateMeta } from '../../services/MetasService';
import { getAuthenticatedUser } from '../../services/UserService';
import { useTheme } from '../../services/ThemeContext';

export const MetaStatus = Object.freeze({
  CONCLUIDO: 'Concluído',
  EM_ANDAMENTO: 'Em Andamento',
  NAO_INICIADO: 'Não Iniciado',
});

const Container = styled.View`
  flex: 1;
  background-color: ${props => props.theme.background};
  padding: 16px;
`;

const Label = styled.Text`
  color: ${props => props.theme.textLight};
  font-size: 16px;
  margin-bottom: 4px;
`;

const Input = styled.TextInput`
  background-color: ${props => props.theme.cardBackground};
  color: ${props => props.theme.textLight};
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid ${props => props.theme.border || 'transparent'};
`;

const StatusContainer = styled.View`
  flex-direction: column;
  margin-bottom: 16px;
  gap: 8px;
`;

const MetaFormScreen = ({ navigation, route }) => {
  const editingMeta = route.params?.meta;
  const { colors } = useTheme();

  const [nome, setNome] = useState(editingMeta ? editingMeta.nome : '');
  const [descricao, setDescricao] = useState(editingMeta ? editingMeta.descricao : '');
  const [status, setStatus] = useState(editingMeta ? editingMeta.status : MetaStatus.NAO_INICIADO);

  const handleSave = async () => {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const user = await getAuthenticatedUser();
      if (!user || !user.id) {
        Alert.alert('Erro', 'Usuário não autenticado.');
        return;
      }

      const metaData = { nome, descricao, status, userId: user.id };

      if (editingMeta) {
        await updateMeta(editingMeta.id, metaData);
        Alert.alert('Sucesso', 'Meta atualizada com sucesso!');
      } else {
        await createMeta(metaData);
        Alert.alert('Sucesso', 'Meta criada com sucesso!');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao salvar a meta. Tente novamente.');
      console.error('Erro ao salvar meta:', error);
    }
  }

  return (
    <Container>
      <Label>Nome:</Label>
      <Input
        placeholder="Nome da meta"
        placeholderTextColor={colors.textSecondary}
        value={nome}
        onChangeText={setNome}
      />

      <Label>Descrição:</Label>
      <Input
        style={{ height: 100, textAlignVertical: 'top' }}
        placeholder="Descreva sua meta"
        placeholderTextColor={colors.textSecondary}
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      <Label>Status:</Label>
      <StatusContainer>
        {Object.values(MetaStatus).map((s) => (
          <Button
            key={s}
            title={s}
            onPress={() => setStatus(s)}
            style={{
              backgroundColor: status === s ? colors.success : colors.cardBackground,
              marginBottom: 8
            }}
            textStyle={{
              color: status === s ? '#FFF' : colors.textLight
            }}
          />
        ))}
      </StatusContainer>

      <Button
        title={editingMeta ? 'Salvar Alterações' : 'Adicionar Meta'}
        onPress={handleSave}
      />
    </Container>
  );
};

export default MetaFormScreen;