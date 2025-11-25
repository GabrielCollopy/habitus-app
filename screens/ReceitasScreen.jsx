import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import ReceitasList from '../components/Receitas/ReceitasList';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../services/ThemeContext';

const SearchContainer = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 20px;
  padding-horizontal: 15px;
  margin-bottom: 15px;
`;

const SearchBar = styled.TextInput`
  flex: 1;
  height:45px;
  color: ${props => props.theme.textLight};
  padding-left: 10px;
  font-size: 16px;
`;

const ScreenContainer = styled.View`
    flex: 1;
    background-color: ${props => props.theme.background};
`;

const SearchWrapper = styled.View`
    padding-horizontal: 16px;
    padding-vertical: 10px;
    background-color: ${props => props.theme.background};
`;

const ReceitasScreen = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { colors } = useTheme();

    return (
        <ScreenContainer>
            <SearchWrapper>
                <SearchContainer>
                    <Ionicons name="search" size={20} color={`${colors.textLight}80`} />
                    <SearchBar
                        placeholder="Buscar receita pelo nome..."
                        placeholderTextColor={`${colors.textLight}80`}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                        returnKeyType="search"
                        clearButtonMode="while-editing"
                    />
                </SearchContainer>
            </SearchWrapper>
            <ReceitasList searchTerm={searchTerm} />
        </ScreenContainer>
    );
};

export default ReceitasScreen;