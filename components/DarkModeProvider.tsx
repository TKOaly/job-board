'use client';

import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const DarkModeContext = createContext<[boolean, Dispatch<boolean>]>([
  false,
  () => {},
]);

export const DarkModeProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const fromStorage = window.localStorage.getItem('theme');

    // Prefer user choice, defaults to light if not in storage or prefers-color-scheme
    if (fromStorage) {
      setDark(fromStorage === 'dark');
      return;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDark(true);
    }
  }, []);

  const changeTheme = useCallback(
    (dark: boolean) => {
      window.localStorage.setItem('theme', dark ? 'dark' : 'light');
      setDark(dark);
    },
    [setDark],
  );

  return (
    <DarkModeContext.Provider value={[dark, changeTheme]}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const DarkModeWrapper: React.FC<PropsWithChildren<{}>> = ({
  children,
}) => {
  const [dark] = useDarkMode();

  return (
    <div
      className={dark ? 'dark' : 'light'}
      style={{ height: '100%', width: '100%' }}
    >
      {children}
    </div>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
