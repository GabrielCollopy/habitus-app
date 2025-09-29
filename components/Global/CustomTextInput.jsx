import React from "react";
import { TextInput, StyleSheet } from "react-native";
import styled from "styled-components/native";

const StyledTextInputContainer = styled.View`
  width: 100%;
  margin-bottom: 15px;
`;

const StyledLabel = styled.Text`
  font-weight: bold;
  margin-bottom: 5px;
  color: #ffffffff;
  font-size: 14px;
  `;

const SyledTextInput = styled.TextInput`
    border-width: 1px;
    border-color: #A5D6A7;
    border-radius: 8px;
    padding: 12px;
    color: #ffffffff;
    background-color: rgba(255, 255, 255, 0.1);
    font-size: 16px;
`;

const CustomTextInput = ({ label, multiline, ...props}) => {
    const isMultiline = multiline || false;

    return (
        <StyledTextInputContainer>
            {label && <StyledLabel>{label}</StyledLabel>}
            <SyledTextInput
                {...props}
                multiline={isMultiline}
                style={isMultiline ? {minHeight: 100, textAlignVertical: 'top'} : {}}
                placeholderTextColor="C8E6C9"
            />
        </StyledTextInputContainer>
    );
};

export default CustomTextInput;