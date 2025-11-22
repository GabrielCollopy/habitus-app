import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import styled from "styled-components/native";
import { Ionicons } from '@expo/vector-icons';
import CustomButton from "../Global/CustomButton";
import { COLORS } from "../../constants/Colors";
import { addFavorite, removeFavorite, isFavorite } from "../../services/FavoriteService";
import { useIsFocused } from "@react-navigation/native";
import ComentariosReceita from "./ComentariosReceita";

const CardContainer = styled.TouchableOpacity`
  background-color: ${COLORS.cardBackground}; /* Fundo escuro sutil */
  border-radius: 12px;
  margin-bottom: 15px;
  /* Adicionando uma sombra sutil para profundidade */
  elevation: 5;
  shadow-color: ${COLORS.black}; 
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  border: 1px solid ${COLORS.cardBackground}; /* Borda para evitar CLS */
  overflow: hidden; /* Garante que a imagem respeite o border-radius */
`;

const RecipeImage = styled.Image`
  width: 100%;
  height: 200px;
  resize-mode: cover;
`;

const CardContent = styled.View`
  padding: 16px;
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

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-around; /* Distribuição de espaço entre os botões */
  margin-top: 20px;
  gap: 10px; /* Espaçamento entre botões (RN >= 0.71) */
`;

// -- Componente Principal --
export default function ReceitasCard({ item, onPress }) {
  const [isFav, setIsFav] = useState(false);
  const isFocused = useIsFocused();

  // Verifica o status de favorito quando o card é montado ou a tela ganha foco
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const status = await isFavorite(item.id);
      setIsFav(status);
    };
    checkFavoriteStatus();
  }, [item.id, isFocused]);

  const handleToggleFavorite = async () => {
    if (isFav) {
      await removeFavorite(item.id);
      setIsFav(false);
    } else {
      await addFavorite(item);
      setIsFav(true);
    }
  };

  return (
    <CardContainer onPress={onPress} activeOpacity={0.8}>
      {item.link ? (
        <RecipeImage source={{ uri: item.link }} />
      ) : null}

      <CardContent>
        <Title>{item.nome}</Title>

        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={{ position: 'absolute', top: 16, right: 16, padding: 5, zIndex: 1 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Aumenta a área de toque
        >
          <Ionicons
            name={isFav ? "bookmark" : "bookmark-outline"}
            size={24}
            color={isFav ? COLORS.primary : COLORS.accent}
          />
        </TouchableOpacity>

        <SectionLabel>Ingredientes</SectionLabel>
        <ContentText numberOfLines={3}>
          {Array.isArray(item.ingredientes)
            ? item.ingredientes.map((ing, index) => `${index + 1}. ${ing.nome}`).join('\n')
            : item.ingredientes}
        </ContentText>

        <SectionLabel>Etapas</SectionLabel>
        <ContentText numberOfLines={3}>{item.etapas}</ContentText>

        <ComentariosReceita receitaId={item.id} />
      </CardContent>
    </CardContainer>
  );
}