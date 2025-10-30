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

export default function ReceitaDetalhesModal({ visible, receita, onClose }) {
    if (!receita) {
        return null;
    }

    const handleLinkPress = () => {
        if (receita.link) {
            Linking.openURL(receita.link).catch(err => console.error("Não foi possível abrir o link", err));
        }
    };

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
                        <ContentText>{receita.ingredientes}</ContentText>

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
