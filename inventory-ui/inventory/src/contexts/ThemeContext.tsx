import React, { useState, useEffect, createContext, useContext } from 'react'

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context == undefined) {
        throw new Error("useThme must be used within a ThemeProvider.")
    }
    return context;
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = sessionStorage.getItem("theme") as Theme;
        return savedTheme || "light";
    });

    useEffect(() => {
        sessionStorage.setItem("theme", theme);
        const root = document.documentElement;
        if (theme === 'dark') {
            console.log("Adding dark...")
            root.classList.add('dark');
        } else {
            console.log("Removing dark...")
            root.classList.remove('dark');
        }

    }, [theme])

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    }

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider> 
    )
}