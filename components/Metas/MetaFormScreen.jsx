import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, Alert } from 'react-native';
import Button from '../Global/CustomButton';
import { COLORS } from '../../constants/Colors';
// Importe as funções do seu service
import { createMeta, updateMeta } from '../../services/MetasService';

export const MetaStatus = Object.freeze({
  CONCLUIDO: 'Concluído',
  EM_ANDAMENTO: 'Em Andamento',
  NAO_INICIADO: 'Não Iniciado',
});

const MetaFormScreen = ({ navigation, route }) => {
  // A meta a ser editada (incluindo o id) vem via route.params
  const editingMeta = route.params?.meta;

  const [nome, setNome] = useState(editingMeta ? editingMeta.nome : '');
  const [descricao, setDescricao] = useState(editingMeta ? editingMeta.descricao : '');
  const [status, setStatus] = useState(editingMeta ? editingMeta.status : MetaStatus.NAO_INICIADO);

  const handleSave = async () => {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const metaData = { nome, descricao, status };

    try {
      if (editingMeta) {
        // Se estiver editando, chama a função de update com o ID da meta
        await updateMeta(editingMeta.id, metaData);
        Alert.alert('Sucesso', 'Sua meta foi atualizada!');
      } else {
        // Se for uma nova meta, chama a função de criação
        await createMeta(metaData);
        Alert.alert('Sucesso', 'Sua meta foi adicionada!');
      }
      // Retorna para a tela anterior após salvar
      navigation.goBack();
    } catch (error) {
      // O service já exibe um alerta de erro, então aqui apenas logamos no console.
      console.error('Falha ao salvar a meta:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da meta"
        placeholderTextColor="#888"
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Descreva sua meta"
        placeholderTextColor="#888"
        multiline
        value={descricao}
        onChangeText={setDescricao}
      />

      <Text style={styles.label}>Status:</Text>
      <View style={styles.statusContainer}>
        {Object.values(MetaStatus).map((s) => (
          <Button
            key={s}
            title={s}
            onPress={() => setStatus(s)}
            style={[
              styles.statusButton,
              status === s && styles.statusButtonSelected,
            ]}
          />
        ))}
      </View>

      <Button
        title={editingMeta ? 'Salvar Alterações' : 'Adicionar Meta'}
        onPress={handleSave}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#1b1b1b',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'column',
    marginBottom: 16,
    gap: 8,
  },
  statusButton: {
    backgroundColor: '#2d2d2d',
  },
  statusButtonSelected: {
    backgroundColor: '#4caf50',
  },
});

export default MetaFormScreen;