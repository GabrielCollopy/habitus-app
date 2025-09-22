import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { getReceitas, deleteReceita } from '../../services/ReceitasService';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../Global/CustomButton';

export default function ReceitasList({ atualizar }) {
  const navigation = useNavigation();

  const [receitas, setReceitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReceitas() {
      try {
        const data = await getReceitas();
        setReceitas(data);
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchReceitas();
  }, [atualizar]);

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

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={receitas}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.nome}</Text>

            <Text style={styles.label}>Etapas</Text>
            <Text style={styles.text}>{item.etapas}</Text>

            <Text style={styles.label}>Ingredientes</Text>
            <Text style={styles.text}>{item.ingredientes}</Text>

            {item.link ? (
              <Text style={styles.link}>{item.link}</Text>
            ) : null}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
              <CustomButton
                title="Editar"
                onPress={() => navigation.navigate('ReceitasForm', { receita: item })}
              />
              <CustomButton
                title="Deletar"
                onPress={() => handleDelete(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 6,
    color: '#34495e',
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
  link: {
    marginTop: 8,
    color: '#3498db',
    fontStyle: 'italic',
  },
});
