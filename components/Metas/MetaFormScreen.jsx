import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Button from '../Global/CustomButton';
import { COLORS } from '../../constants/Colors';

export const MetaStatus = Object.freeze({
  CONCLUIDO: 'Concluído',
  EM_ANDAMENTO: 'Em Andamento',
  NAO_INICIADO: 'Não Iniciado',
});

const STORAGE_KEY = '@metas';

const MetaFormScreen = ({ navigation, route }) => {
  const editing = route.params?.meta;
  const indexToEdit = route.params?.index;

  const [nome, setNome] = useState(editing ? editing.nome : '');
  const [descricao, setDescricao] = useState(editing ? editing.descricao : '');
  const [status, setStatus] = useState(editing ? editing.status : MetaStatus.NAO_INICIADO);

  const handleSave = async () => {
    if (!nome.trim() || !descricao.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      let metas = saved ? JSON.parse(saved) : [];

      if (editing) {
        metas[indexToEdit] = { nome, descricao, status };
        Alert.alert('Meta Editada', 'Sua meta foi atualizada com sucesso!');
      } else {
        metas.push({ nome, descricao, status });
        Alert.alert('Meta Salva', 'Sua meta foi adicionada com sucesso!');
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(metas));
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar a meta. Tente novamente.');
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
        title={editing ? 'Salvar Alterações' : 'Adicionar Meta'}
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

