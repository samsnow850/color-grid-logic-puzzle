
import React, { createContext, useContext } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

interface ThemeProviderState {
  theme: "light";
}

const initialState: ThemeProviderState = {
  theme: "light",
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  // Fixed light theme implementation
  const value: ThemeProviderState = {
    theme: "light",
  };

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
    
  return context;
};
