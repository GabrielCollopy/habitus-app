import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReceitasScreen from '../screens/ReceitasScreen';
import ReceitasFormScreen from '../components/Receitas/ReceitasFormScreen';
import { COLORS } from '../constants/Colors';


const Stack = createNativeStackNavigator();

export default function ReceitasStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: true,
                contentStyle: {
                    backgroundColor: COLORS.background,
                },
                headerStyle: {
                    backgroundColor: COLORS.background,
                },
                headerTintColor: COLORS.textLight,
            }}
        >
            <Stack.Screen name="ReceitasList" component={ReceitasScreen} options={{ title: 'Receitas' }} />
            <Stack.Screen name="ReceitasForm" component={ReceitasFormScreen} options={{ title: 'Adicionar Receita' }} />
        </Stack.Navigator>
    );
};
