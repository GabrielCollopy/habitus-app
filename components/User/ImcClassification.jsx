import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { COLORS } from '../../constants/Colors';
import { imcClassifications, getImcClassificationKey } from '../../services/imcUtils';

const Container = styled.View`
    margin-top: 25px;
    padding: 15px;
    border-radius: 12px;
    background-color: ${COLORS.cardBackground};
`;

const Title = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${COLORS.textLight};
    margin-bottom: 15px;
    text-align: center;
`;

const TableHeader = styled.View`
    flex-direction: row;
    border-bottom-width: 1px;
    border-bottom-color: ${COLORS.border};
    padding-bottom: 8px;
    margin-bottom: 8px;
`;

const Row = styled.View`
    flex-direction: row;
    padding: 8px 4px;
    border-radius: 6px;
    background-color: ${props => props.isHighlighted ? `${props.highlightColor}30` : 'transparent'};
`;

const Column = styled.Text`
    font-size: 14px;
    color: ${props => props.isHighlighted ? props.highlightColor : COLORS.textLight};
    font-weight: ${props => props.isHighlighted ? 'bold' : 'normal'};
`;

const ImcClassification = ({ imc }) => {
    const userClassificationKey = getImcClassificationKey(imc);

    if (imc === null || imc === undefined || imc <= 0) {
        return null; // Não renderiza nada se não houver IMC
    }

    return (
        <Container>
            <Title>Classificação do IMC</Title>
            <TableHeader>
                <Column style={{ flex: 2, fontWeight: 'bold' }}>Classificação</Column>
                <Column style={{ flex: 1.5, fontWeight: 'bold', textAlign: 'right' }}>IMC</Column>
            </TableHeader>
            {imcClassifications.map((item) => {
                const isHighlighted = item.key === userClassificationKey;
                return (
                    <Row key={item.key} isHighlighted={isHighlighted} highlightColor={item.color}>
                        <Column 
                            style={{ flex: 2 }} 
                            isHighlighted={isHighlighted} 
                            highlightColor={item.color}
                        >{item.classification}</Column>
                        <Column 
                            style={{ flex: 1.5, textAlign: 'right' }} 
                            isHighlighted={isHighlighted} 
                            highlightColor={item.color}
                        >{item.range}</Column>
                    </Row>
                );
            })}
        </Container>
    );
};

export default ImcClassification;