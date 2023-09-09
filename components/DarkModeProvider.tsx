'use client';

import { createContext, Dispatch, PropsWithChildren, useContext, useState } from "react";

const DarkModeContext = createContext<[boolean, Dispatch<boolean>]>([false, () => {}]);

export const DarkModeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  let initialTheme = 'light';

  if (typeof window !== 'undefined') {
    const fromStorage = window.localStorage.getItem('theme');

    if (fromStorage) {
      initialTheme = fromStorage;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialTheme = 'dark'; 
    }
  }

  const [dark, setDark] = useState(initialTheme === 'dark');

  const changeTheme = (dark: boolean) => {
    window.localStorage.setItem('theme', dark ? 'dark' : 'light');
    setDark(dark);
  };


  return (
    <DarkModeContext.Provider value={[dark, changeTheme]}>{children}</DarkModeContext.Provider>
  );
};

export const DarkModeWrapper: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [dark] = useDarkMode();

  return (
    <div className={dark ? 'dark' : 'light'} style={{ height: '100%', width: '100%' }}>
      {children}
    </div>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
