'use client';

import { createContext, Dispatch, useContext, useState } from "react";

const DarkModeContext = createContext<[boolean, Dispatch<boolean>]>([false, () => {}]);

export const DarkModeProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  let initialTheme = window.localStorage.getItem('theme');

  if (initialTheme === null && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    initialTheme = 'dark'; 
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

export const useDarkMode = () => useContext(DarkModeContext);
