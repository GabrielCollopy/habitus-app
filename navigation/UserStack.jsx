import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserScreen from '../screens/UserScreen';
import { COLORS } from '../constants/Colors';

const Stack = createNativeStackNavigator();

export default function UserStack() {
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
            <Stack.Screen name="UserDetails" component={UserScreen} options={{ title: 'Meus Dados' }} />
        </Stack.Navigator>
    );
};