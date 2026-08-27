import React, {createContext, useContext, useEffect, useState, useCallback} from "react";

export type Theme = "light" | "dark";

interface ThemeContextValue {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
    theme: "light",
    toggleTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

interface ThemeProviderProps {
    defaultTheme?: Theme;
    children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({defaultTheme = "light", children}) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const stored = localStorage.getItem("lys-theme");
        return (stored === "light" || stored === "dark") ? stored : defaultTheme;
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("lys-theme", theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === "light" ? "dark" : "light");
    }, []);

    return (
        <ThemeContext.Provider value={{theme, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};

ThemeProvider.displayName = "ThemeProvider";

export default ThemeProvider;
