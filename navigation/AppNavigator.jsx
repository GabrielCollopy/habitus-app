import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InitialScreen from "../screens/InitialScreen";
import CadastroScreen from "../screens/CadastroScreen";
import BottomNavigator from "../components/Global/BottomNavigator";
import LoginScreen from "../screens/LoginScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Initial"
        >
            <Stack.Screen name="Initial" component={InitialScreen} />
            <Stack.Screen name="Cadastro" component={CadastroScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="AppContent" component={BottomNavigator} />
        </Stack.Navigator>
    )
}