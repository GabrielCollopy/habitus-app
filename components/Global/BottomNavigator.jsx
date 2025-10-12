import React from 'react';
import { StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ReceitasStack from '../../navigation/ReceitasStack';
import UserStack from '../../navigation/UserStack';
import { COLORS } from '../../constants/Colors';
import MetasScreen from '../../screens/MetasScreen';
import MetasStack from '../../navigation/MetasStack';

const Tab = createBottomTabNavigator();

export default function BottomNavigator() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarActiveTintColor: COLORS.activeTab,   // cor ativa
                tabBarInactiveTintColor: COLORS.inactiveTab, // cor inativa

                tabBarIcon: ({ color, size }) => {
                    let iconName;

                    if (route.name === 'Receitas') {
                        iconName = 'restaurant-outline';
                    }
                    if (route.name === 'Detalhes do Usuário') {
                        iconName = 'person-circle-outline';
                    }
                    if (route.name === 'Metas')
                        iconName = 'clipboard'
                    

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}>
            <Tab.Screen
                name="Receitas"
                component={ReceitasStack}
                options={{
                    tabBarLabel: 'Receitas',
                }}
            />
            <Tab.Screen
                name="Detalhes do Usuário"
                component={UserStack}
                options={{
                    tabBarLabel: 'Meu Perfil',
                }}
            />
            <Tab.Screen
                name="Metas"
                component={MetasStack}
                options={{
                    tabBarLabel: 'Metas',
                }}
            />
        </Tab.Navigator>
    );
}


const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: COLORS.tabBarBackground,
        borderTopWidth: 0,
        height: 60,
    },
    tabBarLabel: {
        color: COLORS.textLight,
        fontSize: 12,
        fontWeight: "600",
    },
});