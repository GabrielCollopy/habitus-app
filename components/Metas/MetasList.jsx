import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = '@metas';

const MetasList = ({ refreshTrigger }) => {
  const [metas, setMetas] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    loadMetas();
  }, [refreshTrigger]);

  const loadMetas = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      setMetas(saved ? JSON.parse(saved) : []);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao carregar metas. Tente novamente.');
    }
  };

  const handleDelete = async (index) => {
    try {
      const updated = metas.filter((_, i) => i !== index);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setMetas(updated);
      Alert.alert('Meta Excluída', 'A meta foi excluída com sucesso!');
    } catch {
      Alert.alert('Erro', 'Não foi possível excluir a meta. Tente novamente.');
    }
  };

  const handleEdit = (item, index) => {
    navigation.navigate('MetaForm', { meta: item, index });
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.metaItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.metaTitle}>{item.nome}</Text>
        <Text style={styles.metaDescription}>{item.descricao}</Text>
        <Text style={styles.metaStatus}>Status: {item.status}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item, index)}>
          <Ionicons name="create-outline" size={22} color="#4caf50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(index)}>
          <Ionicons name="trash-outline" size={22} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {metas.length === 0 ? (
        <Text style={styles.emptyText}>Nenhuma meta encontrada. Adicione uma nova!</Text>
      ) : (
        <FlatList
          data={metas}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1b1b1b',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
  },
  metaTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  metaDescription: {
    color: '#ccc',
    fontSize: 14,
    marginVertical: 4,
  },
  metaStatus: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  emptyText: {
    color: '#ccc',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default MetasList;
