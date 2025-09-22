import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReceitasScreen from '../screens/ReceitasScreen';
import ReceitasFormScreen from '../components/Receitas/ReceitasFormScreen';

const Stack = createNativeStackNavigator();

export default function ReceitasStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="ReceitasList" component={ReceitasScreen} options={{title: 'Minhas Receitas'}} />
            <Stack.Screen name="ReceitasForm" component={ReceitasFormScreen} options={{title: 'Adicionar Receita'}} />
        </Stack.Navigator>
    );
};
