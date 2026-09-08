import { createContext, useContext, useMemo, useState } from 'react';

// Color mode (light/dark) persisted in localStorage so the user's choice survives reloads.
const ColorModeContext = createContext();

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    const saved = localStorage.getItem('color-mode');
    return saved || 'dark';
  });

  const toggleColorMode = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('color-mode', next);
      return next;
    });
  };

  const value = useMemo(
    () => ({ mode, toggleColorMode }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

export const useColorMode = () => useContext(ColorModeContext);