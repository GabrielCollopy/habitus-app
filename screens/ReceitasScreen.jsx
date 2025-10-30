import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import ReceitasList from '../components/Receitas/ReceitasList';
import { COLORS } from '../constants/Colors';
import { Ionicons } from '@expo/vector-icons';

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${COLORS.cardBackground};
  border-radius: 20px;
  padding-horizontal: 15px;
  margin-bottom: 15px;
`;

const SearchBar = styled.TextInput`
  flex: 1;
  height:45px;
  color: ${COLORS.textLight};
  padding-left: 10px; /* Espaço entre o ícone e o texto */
  font-size: 16px;
`;

const ReceitasScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.searchWrapper}>
                <SearchContainer>
                    <Ionicons name="search" size={20} color={`${COLORS.textLight}80`} />
                <SearchBar
                    placeholder="Buscar receita pelo nome..."
                    placeholderTextColor={`${COLORS.textLight}80`} // Cor com opacidade
                    value={searchTerm}
                    onChangeText={setSearchTerm}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                />
                </SearchContainer>
            </View>
            <ReceitasList searchTerm={searchTerm} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    searchWrapper: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: COLORS.background,
    },
});

export default ReceitasScreen;