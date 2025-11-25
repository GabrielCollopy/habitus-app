import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../../services/ThemeContext';

const Container = styled.View`
    margin-top: 20px;
    padding: 15px;
    background-color: ${props => props.theme.cardBackground};
    border-radius: 10px;
    width: 100%;
`;

const Title = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.textLight};
    margin-bottom: 10px;
    text-align: center;
`;

const TableHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    border-bottom-width: 1px;
    border-bottom-color: ${props => props.theme.border};
    padding-bottom: 5px;
    margin-bottom: 5px;
`;

const HeaderText = styled.Text`
    font-weight: bold;
    color: ${props => props.theme.textSecondary};
    flex: 1;
    text-align: center;
`;

const TableRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding-vertical: 5px;
    background-color: ${props => props.isHighlighted ? props.theme.accent + '33' : 'transparent'};
    border-radius: 4px;
`;

const CellText = styled.Text`
    color: ${props => props.isHighlighted ? props.theme.accent : props.theme.textLight};
    flex: 1;
    text-align: center;
    font-weight: ${props => props.isHighlighted ? 'bold' : 'normal'};
`;

const ImcClassification = ({ currentImc }) => {
    const { colors } = useTheme();

    const classifications = [
        { range: "Abaixo de 18.5", classification: "Abaixo do peso" },
        { range: "18.5 - 24.9", classification: "Peso normal" },
        { range: "25.0 - 29.9", classification: "Sobrepeso" },
        { range: "30.0 - 34.9", classification: "Obesidade Grau I" },
        { range: "35.0 - 39.9", classification: "Obesidade Grau II" },
        { range: "Acima de 40.0", classification: "Obesidade Grau III" },
    ];

    const getHighlightIndex = (imc) => {
        if (!imc) return -1;
        if (imc < 18.5) return 0;
        if (imc < 25.0) return 1;
        if (imc < 30.0) return 2;
        if (imc < 35.0) return 3;
        if (imc < 40.0) return 4;
        return 5;
    };

    const highlightIndex = getHighlightIndex(currentImc);

    return (
        <Container>
            <Title>Classificação IMC</Title>
            <TableHeader>
                <HeaderText>IMC</HeaderText>
                <HeaderText>Classificação</HeaderText>
            </TableHeader>
            {classifications.map((item, index) => (
                <TableRow key={index} isHighlighted={index === highlightIndex}>
                    <CellText isHighlighted={index === highlightIndex}>{item.range}</CellText>
                    <CellText isHighlighted={index === highlightIndex}>{item.classification}</CellText>
                </TableRow>
            ))}
        </Container>
    );
};

export default ImcClassification;