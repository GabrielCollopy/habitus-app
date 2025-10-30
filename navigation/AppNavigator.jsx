import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InitialScreen from "../screens/InitialScreen";
import CadastroScreen from "../screens/CadastroScreen";
import BottomNavigator from "../components/Global/BottomNavigator";
import LoginScreen from "../screens/LoginScreen";
import { ActivityIndicator, View } from "react-native"; // Para uma tela de loading
import { useAuth } from "../services/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const { isUserLoggedIn } = useAuth();

    // Mostra um indicador de carregamento enquanto o AuthContext verifica o token inicial
    if (isUserLoggedIn === null) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;
    }

    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName={isUserLoggedIn ? "AppContent" : "Initial"}
        >
            {isUserLoggedIn ? (
                 <Stack.Screen name="AppContent" component={BottomNavigator} />
            ) : (
                <>
                    <Stack.Screen name="Initial" component={InitialScreen} />
                    <Stack.Screen name="Cadastro" component={CadastroScreen} />
                    <Stack.Screen name="Login" component={LoginScreen} />
                </>
            )}
        </Stack.Navigator>
    )
}