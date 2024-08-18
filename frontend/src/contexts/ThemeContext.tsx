import { Dispatch, FC, SetStateAction, createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
    darkTheme: boolean,
    setDarkTheme: Dispatch<SetStateAction<boolean>>
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
      throw new Error("useTheme must be used within an ThemeProvider");
    }
    return context;
}

export const ThemeProvider: FC<{children: React.ReactNode}> = ({children}) => {
    const [darkTheme, setDarkTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const theme = localStorage.getItem('theme');
          return (theme && theme === 'dark') ? true: false;
        }
        return false;
      });

    useEffect(() => {
        if (darkTheme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        }
        else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [darkTheme])

    return (
    <ThemeContext.Provider value={{darkTheme, setDarkTheme}}>
        {children}
    </ThemeContext.Provider>
)
}


