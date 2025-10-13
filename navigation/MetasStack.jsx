import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MetasScreen from '../screens/MetasScreen';
import MetaFormScreen from '../components/Metas/MetaFormScreen';
import { COLORS } from '../constants/Colors'; // Importe suas cores

const Stack = createNativeStackNavigator();

const MetasStack = () => {
  return (
    <Stack.Navigator
      // As screenOptions foram copiadas do ReceitasStack para garantir a consistência visual
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
      <Stack.Screen
        // Renomeado para 'MetasList' para seguir o padrão de 'ReceitasList'
        name="MetasList"
        component={MetasScreen}
        options={{ title: 'Minhas Metas' }}
      />
      <Stack.Screen
        name="MetaForm"
        component={MetaFormScreen}
        // Melhoria: Título dinâmico que muda se estiver editando ou adicionando
        options={({ route }) => ({
          title: route.params?.meta ? 'Editar Meta' : 'Adicionar Meta',
        })}
      />
    </Stack.Navigator>
  );
};

export default MetasStack;