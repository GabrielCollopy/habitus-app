import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InitialScreen from "../screens/InitialScreen";
import CadastroScreen from "../screens/CadastroScreen";
import BottomNavigator from "../components/Global/BottomNavigator";
import LoginScreen from "../screens/LoginScreen";
import { initializeAuth } from "../services/AuthService";
import { ActivityIndicator, View } from "react-native"; // Para uma tela de loading

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const token = await initializeAuth();
            setIsUserLoggedIn(!!token);
        };
        checkAuth();
    }, []);

    // Mostra um indicador de carregamento enquanto verifica o token
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