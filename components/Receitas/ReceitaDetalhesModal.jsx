import React from 'react';
import { Modal, View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

const ModalContainer = styled.View`
  flex: 1;
  justify-content: flex-end; /* Alinha o modal na parte inferior */
  background-color: ${COLORS.modalBackdrop}; /* Fundo escurecido */
`;

const ModalContent = styled.View`
  background-color: ${COLORS.cardBackground};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 20px;
  max-height: 85%; 
  shadow-color: ${COLORS.black};
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
  border-bottom-color: ${COLORS.border};
  padding-bottom: 10px;
  margin-bottom: 15px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${COLORS.primary};
  flex: 1; /* Permite que o título ocupe o espaço disponível */
`;

const SectionLabel = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${COLORS.textLight};
  margin-top: 15px;
  margin-bottom: 8px;
`;

const ContentText = styled.Text`
  font-size: 16px;
  color: ${COLORS.textLight};
  line-height: 24px;
`;

const LinkText = styled.Text`
  margin-top: 10px;
  color: ${COLORS.accent};
  font-style: italic;
  text-decoration-line: underline;
  font-size: 16px;
`;

const IngredientItem = styled.View`
  margin-bottom: 15px;
  padding: 12px;
  background-color: ${COLORS.cardBackground};
  border-radius: 8px;
  border: 1px solid ${COLORS.border};
`;

const IngredientName = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${COLORS.primary};
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
  color: ${COLORS.textLight};
  opacity: 0.8;
`;

const NutritionalValue = styled.Text`
  font-size: 14px;
  color: ${COLORS.accent};
  font-weight: 600;
`;

const TotalNutritionalInfo = styled.View`
  margin-top: 15px;
  padding: 15px;
  background-color: ${COLORS.cardBackground};
  border-radius: 8px;
  border: 2px solid ${COLORS.accent};
`;

const TotalLabel = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${COLORS.accent};
  margin-bottom: 10px;
  text-align: center;
`;

export default function ReceitaDetalhesModal({ visible, receita, onClose }) {
    if (!receita) {
        return null;
    }

    const handleLinkPress = () => {
        if (receita.link) {
            Linking.openURL(receita.link).catch(err => console.error("Não foi possível abrir o link", err));
        }
    };

    // Calcular totais nutricionais
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
                            <Ionicons name="close-circle" size={30} color={COLORS.accent} />
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

                        {receita.link ? (
                            <TouchableOpacity onPress={handleLinkPress}><LinkText>Ver receita original</LinkText></TouchableOpacity>
                        ) : null}
                    </ScrollView>
                </ModalContent>
            </ModalContainer>
        </Modal>
    );
}
