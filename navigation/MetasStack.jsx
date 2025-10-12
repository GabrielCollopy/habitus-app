import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MetasScreen from '../screens/MetasScreen';
import MetaFormScreen from '../components/Metas/MetaFormScreen';

const Stack = createNativeStackNavigator();

const MetasStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Metas"
      screenOptions={{
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="Metas"
        component={MetasScreen}
        options={{ title: 'Minhas Metas' }}
      />
      <Stack.Screen
        name="MetaForm"
        component={MetaFormScreen}
        options={{ title: 'Adicionar Meta' }}
      />
    </Stack.Navigator>
  );
};

export default MetasStack;
