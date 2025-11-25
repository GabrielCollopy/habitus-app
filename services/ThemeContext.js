import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { COLORS as DEFAULT_COLORS } from '../constants/Colors';

const ThemeContext = createContext();

export const THEMES = {
    DEFAULT: 'default',
    LIGHT: 'light',
    DARK: 'dark',
};

const PALETTES = {
    [THEMES.DEFAULT]: {
        ...DEFAULT_COLORS,
        primaryTextShadow: null,
    },
    [THEMES.LIGHT]: {
        ...DEFAULT_COLORS,
        background: "#FFFFFF",
        cardBackground: "#F2F2F7",
        tabBarBackground: "#F2F2F7",
        textLight: "#1C1C1E", // Inverted for light mode
        textSecondary: "#8E8E93",
        border: "#E5E5EA",
        // Keep accents
        primary: DEFAULT_COLORS.primary,
        accent: DEFAULT_COLORS.accent,
        primaryTextShadow: {
            textShadowColor: '#000000',
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 3,
        },
    },
    [THEMES.DARK]: {
        ...DEFAULT_COLORS,
        background: "#000000", // Pure black
        cardBackground: "#16181C", // Dark gray like X
        tabBarBackground: "#16181C",
        textLight: "#FFFFFF",
        textSecondary: "#71767B",
        border: "#2F3336",
        // Keep accents
        primary: DEFAULT_COLORS.primary,
        accent: DEFAULT_COLORS.accent,
        primaryTextShadow: null,
    }
};

export const ThemeProvider = ({ children }) => {
    const [themeName, setThemeName] = useState(THEMES.DEFAULT);
    const [colors, setColors] = useState(PALETTES[THEMES.DEFAULT]);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('userTheme');
                if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
                    setThemeName(savedTheme);
                    setColors(PALETTES[savedTheme]);
                }
            } catch (error) {
                console.error("Failed to load theme:", error);
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async (newTheme) => {
        if (Object.values(THEMES).includes(newTheme)) {
            setThemeName(newTheme);
            setColors(PALETTES[newTheme]);
            try {
                await AsyncStorage.setItem('userTheme', newTheme);
            } catch (error) {
                console.error("Failed to save theme:", error);
            }
        }
    };

    return (
        <ThemeContext.Provider value={{ theme: themeName, colors, toggleTheme }}>
            <StyledThemeProvider theme={colors}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
