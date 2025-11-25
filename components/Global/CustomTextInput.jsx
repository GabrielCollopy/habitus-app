import React from 'react';
import styled from 'styled-components/native';
import { useTheme } from '../../services/ThemeContext';

const InputContainer = styled.View`
    margin-bottom: 15px;
    width: 100%;
`;

const Label = styled.Text`
    font-size: 16px;
    margin-bottom: 5px;
    color: ${props => props.theme.textLight};
    font-weight: bold;
`;

const StyledInput = styled.TextInput`
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid ${props => props.theme.border};
    font-size: 16px;
    background-color: ${props => props.theme.background};
    color: ${props => props.theme.textLight};
`;

const CustomTextInput = ({ label, ...props }) => {
    const { colors } = useTheme();
    return (
        <InputContainer>
            {label && <Label>{label}</Label>}
            <StyledInput
                {...props}
                placeholderTextColor={props.placeholderTextColor || colors.textSecondary}
            />
        </InputContainer>
    );
};

export default CustomTextInput;