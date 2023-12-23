'use server';

import i18n, { createInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import enLocale from '../locales/en.json';
import fiLocale from '../locales/fi.yaml';

const init = () => {
  // const i18n = createInstance();

  i18n
    .use(initReactI18next)
    .init({
      resources: {
        en: {
          translation: enLocale,
        },
        fi: {
          translation: fiLocale,
        },
      },
      supportedLngs: ['en', 'fi'],
    });

  return i18n;
}

export const useTranslation = () => {
  const i18n = init();

  console.log(i18n);

  return {
    t: i18n.getFixedT('fi'),
    i18n,
  }
}

export const TranslationProvider = ({ children }) => {
  return (
    <div>
      {children}
    </div>
  );
}
