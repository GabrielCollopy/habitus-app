import React from 'react';
import { View } from 'react-native';
import styled from "styled-components/native";
import { COLORS } from '../../constants/Colors';

const InputContainer = styled.View`
  width: 100%;
  margin-bottom: 15px;
`;

const InputWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    border: 1px solid ${COLORS.border};
    border-radius: 8px;
    background-color: ${COLORS.background};
`;

const Label = styled.Text`
  font-weight: bold;
  margin-bottom: 5px;
  color: ${COLORS.textLight};
  font-size: 14px;
`;

const StyledInput = styled.TextInput.attrs(props => ({
    placeholderTextColor: props.placeholderTextColor || COLORS.textSecondary,
}))`
    flex: 1;
    padding: 12px;
    color: ${COLORS.textLight};
    font-size: 16px;
`;

const CustomTextInput = ({ label, multiline, icon, ...props}) => {
    return (
        <InputContainer>
            {label && <Label>{label}</Label>}
            <InputWrapper>
                <StyledInput
                    {...props}
                    multiline={multiline}
                    // Aplica altura mínima e alinhamento para campos de várias linhas
                    style={multiline ? { minHeight: 100, textAlignVertical: 'top' } : {}}
                />
                {/* Renderiza o ícone se ele for passado como propriedade */}
                {icon}
            </InputWrapper>
        </InputContainer>
    );
};

export default CustomTextInput;