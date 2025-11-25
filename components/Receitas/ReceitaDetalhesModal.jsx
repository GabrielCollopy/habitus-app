import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../services/ThemeContext';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: ${props => props.theme.modalBackdrop || 'rgba(0,0,0,0.5)'};
`;

const ModalContent = styled.View`
  background-color: ${props => props.theme.cardBackground};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  max-height: 85%; 
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
  elevation: 10;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: ${props => props.theme.border};
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.primary};
  ${props => props.theme.primaryTextShadow && `
    text-shadow-color: ${props.theme.primaryTextShadow.textShadowColor};
    text-shadow-offset: ${props.theme.primaryTextShadow.textShadowOffset.width}px ${props.theme.primaryTextShadow.textShadowOffset.height}px;
    text-shadow-radius: ${props.theme.primaryTextShadow.textShadowRadius}px;
  `}
  flex: 1;
`;

const SectionLabel = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.textLight};
  margin-top: 15px;
  margin-bottom: 8px;
`;

const ContentText = styled.Text`
  font-size: 16px;
  color: ${props => props.theme.textLight};
  line-height: 24px;
`;

const IngredientItem = styled.View`
  margin-bottom: 15px;
  padding: 12px;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
`;

const IngredientName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.primary};
  ${props => props.theme.primaryTextShadow && `
    text-shadow-color: ${props.theme.primaryTextShadow.textShadowColor};
    text-shadow-offset: ${props.theme.primaryTextShadow.textShadowOffset.width}px ${props.theme.primaryTextShadow.textShadowOffset.height}px;
    text-shadow-radius: ${props.theme.primaryTextShadow.textShadowRadius}px;
  `}
  margin-bottom: 8px;
`;

const NutritionalInfo = styled.View`
  margin-top: 8px;
`;

const NutritionalRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const NutritionalLabel = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.textLight};
  opacity: 0.8;
`;

const NutritionalValue = styled.Text`
  font-size: 14px;
  color: ${props => props.theme.accent};
  font-weight: 600;
`;

const TotalNutritionalInfo = styled.View`
  margin-top: 15px;
  padding: 15px;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 8px;
  border: 2px solid ${props => props.theme.accent};
`;

const TotalLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.accent};
  margin-bottom: 10px;
  text-align: center;
`;

export default function ReceitaDetalhesModal({ visible, receita, onClose }) {
  const { colors } = useTheme();

  if (!receita) {
    return null;
  }

  const calcularTotais = () => {
    if (!Array.isArray(receita.ingredientes)) return null;

    return receita.ingredientes.reduce((acc, ing) => ({
      calorias: acc.calorias + (ing.calorias || 0),
      proteinas: acc.proteinas + (ing.proteinas || 0),
      gorduras: acc.gorduras + (ing.gorduras || 0),
      carboidratos: acc.carboidratos + (ing.carboidratos || 0),
    }), { calorias: 0, proteinas: 0, gorduras: 0, carboidratos: 0 });
  };

  const totais = calcularTotais();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ModalContainer>
        <ModalContent>
          <Header>
            <Title>{receita.nome}</Title>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={30} color={colors.accent} />
            </TouchableOpacity>
          </Header>
          <ScrollView showsVerticalScrollIndicator={false}>
            <SectionLabel>Ingredientes</SectionLabel>
            {Array.isArray(receita.ingredientes) ? (
              <>
                {receita.ingredientes.map((ing, index) => (
                  <IngredientItem key={ing.id || index}>
                    <IngredientName>{index + 1}. {ing.nome}</IngredientName>
                    {ing.descricao && (
                      <ContentText style={{ fontSize: 14, marginBottom: 8, opacity: 0.8 }}>
                        {ing.descricao}
                      </ContentText>
                    )}
                    <NutritionalInfo>
                      <NutritionalRow>
                        <NutritionalLabel>Calorias:</NutritionalLabel>
                        <NutritionalValue>{ing.calorias ? `${ing.calorias.toFixed(1)} kcal` : 'N/A'}</NutritionalValue>
                      </NutritionalRow>
                      <NutritionalRow>
                        <NutritionalLabel>Proteínas:</NutritionalLabel>
                        <NutritionalValue>{ing.proteinas ? `${ing.proteinas.toFixed(1)}g` : 'N/A'}</NutritionalValue>
                      </NutritionalRow>
                      <NutritionalRow>
                        <NutritionalLabel>Gorduras:</NutritionalLabel>
                        <NutritionalValue>{ing.gorduras ? `${ing.gorduras.toFixed(1)}g` : 'N/A'}</NutritionalValue>
                      </NutritionalRow>
                      <NutritionalRow>
                        <NutritionalLabel>Carboidratos:</NutritionalLabel>
                        <NutritionalValue>{ing.carboidratos ? `${ing.carboidratos.toFixed(1)}g` : 'N/A'}</NutritionalValue>
                      </NutritionalRow>
                    </NutritionalInfo>
                  </IngredientItem>
                ))}
                {totais && (
                  <TotalNutritionalInfo>
                    <TotalLabel>Total Nutricional da Receita</TotalLabel>
                    <NutritionalRow>
                      <NutritionalLabel style={{ fontSize: 16, fontWeight: 'bold' }}>Calorias:</NutritionalLabel>
                      <NutritionalValue style={{ fontSize: 16 }}>{totais.calorias.toFixed(1)} kcal</NutritionalValue>
                    </NutritionalRow>
                    <NutritionalRow>
                      <NutritionalLabel style={{ fontSize: 16, fontWeight: 'bold' }}>Proteínas:</NutritionalLabel>
                      <NutritionalValue style={{ fontSize: 16 }}>{totais.proteinas.toFixed(1)}g</NutritionalValue>
                    </NutritionalRow>
                    <NutritionalRow>
                      <NutritionalLabel style={{ fontSize: 16, fontWeight: 'bold' }}>Gorduras:</NutritionalLabel>
                      <NutritionalValue style={{ fontSize: 16 }}>{totais.gorduras.toFixed(1)}g</NutritionalValue>
                    </NutritionalRow>
                    <NutritionalRow>
                      <NutritionalLabel style={{ fontSize: 16, fontWeight: 'bold' }}>Carboidratos:</NutritionalLabel>
                      <NutritionalValue style={{ fontSize: 16 }}>{totais.carboidratos.toFixed(1)}g</NutritionalValue>
                    </NutritionalRow>
                  </TotalNutritionalInfo>
                )}
              </>
            ) : (
              <ContentText>{receita.ingredientes}</ContentText>
            )}

            <SectionLabel>Etapas</SectionLabel>
            <ContentText>{receita.etapas}</ContentText>


          </ScrollView>
        </ModalContent>
      </ModalContainer>
    </Modal>
  );
}
