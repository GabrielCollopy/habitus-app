import React from 'react';
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReceitasStack from '../../navigation/ReceitasStack';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarActiveTintColor: "#fcfcfcff",   // cor ativa
                tabBarInactiveTintColor: "#8e8e93", // cor inativa
            }}>
            <Tab.Screen name="Receitas" component={ReceitasStack} options={{ headerShown: false }} />
        </Tab.Navigator>
    );
}


const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#113d11c4',
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        height: 60,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: "600",
    },
});