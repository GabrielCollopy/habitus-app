import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
// Importe as funções do seu service
import { getMetas, deleteMeta } from '../../services/MetasService'; // Ajuste o caminho se necessário
import { getAuthenticatedUser } from '../../services/UserService';

const MetasList = () => { // Removido refreshTrigger, pois usaremos useFocusEffect
  const [metas, setMetas] = useState([]);
  const navigation = useNavigation();

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
    <View style={styles.metaItem}>
      <View style={{ flex: 1 }}>
        <Text style={styles.metaTitle}>{item.nome}</Text>
        <Text style={styles.metaDescription}>{item.descricao}</Text>
        <Text style={styles.metaStatus}>Status: {item.status}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleEdit(item)}>
          <Ionicons name="create-outline" size={22} color="#4caf50" />
        </TouchableOpacity>
        {/* Chama o handleDelete passando o ID da meta */}
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
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
          // Use o ID da meta como chave, que é único
          keyExtractor={(item) => item.id.toString()}
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