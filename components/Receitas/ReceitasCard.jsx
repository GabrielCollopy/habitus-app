import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from '@expo/vector-icons';
import CustomButton from "../Global/CustomButton";
import { COLORS } from "../../constants/Colors";

const CardContainer = styled.TouchableOpacity`
  background-color: ${COLORS.cardBackground}; /* Fundo escuro sutil */
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 15px;
  /* Adicionando uma sombra sutil para profundidade */
  elevation: 5;
  shadow-color: ${COLORS.black}; 
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  border: 1px solid ${COLORS.cardBackground}; /* Borda para evitar CLS */
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
  color: ${COLORS.primary}; /* Título com cor de destaque */
`;

const SectionLabel = styled.Text`
  font-weight: bold;
  margin-top: 10px;
  color: ${COLORS.textLight}; /* Rótulo em branco suave */
  font-size: 14px;
`;

const ContentText = styled.Text`
  font-size: 15px;
  color: ${COLORS.textLight};
  line-height: 22px;
  margin-bottom: 5px;
`;

const LinkText = styled.Text`
  margin-top: 8px;
  color: ${COLORS.accent}; /* Link em cor de acento */
  font-style: italic;
  text-decoration-line: underline;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-around; /* Distribuição de espaço entre os botões */
  margin-top: 20px;
  gap: 10px; /* Espaçamento entre botões (RN >= 0.71) */
`;

// -- Componente Principal --
export default function ReceitasCard({ item, onPress }) {
    // Removi as props onEdit e onDelete, pois o card agora só abre o modal
    return (
        <CardContainer onPress={onPress} activeOpacity={0.8}>
            <Title>{item.nome}</Title>

            <Ionicons
                name="bookmark-outline"
                size={20}
                color={COLORS.accent}
                style={{ position: 'absolute', top: 16, right: 16 }}
            />

            <SectionLabel>Etapas</SectionLabel>
            <ContentText numberOfLines={3}>{item.etapas}</ContentText>

            <SectionLabel>Ingredientes</SectionLabel>
            <ContentText numberOfLines={3}>{item.ingredientes}</ContentText>

            {item.link ? (
                <LinkText>{item.link}</LinkText>
            ) : null}

            {/* O ButtonRow com os botões de editar e deletar foi removido.
                Essas ações podem ser adicionadas dentro do modal de detalhes
                para uma interface mais limpa. 
            */}
        </CardContainer>
    );
}