import React, { createContext, useState, useEffect, useContext } from 'react';

// Create a context with default values
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

// Custom hook for consuming the ThemeContext
export const useTheme = () => useContext(ThemeContext);

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Initialize state from local storage or default to 'light'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme : 'light';
  });

  useEffect(() => {
    // Update local storage whenever theme changes
    localStorage.setItem('theme', theme);
    // Apply the dark class to the root element
    document.documentElement.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
