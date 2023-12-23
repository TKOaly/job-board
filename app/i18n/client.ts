'use client'

import i18next from 'i18next'
import { useParams } from 'next/navigation'
import { initReactI18next } from 'react-i18next'
import { fallbackLang, getOptions } from './settings'

i18next
  .use(initReactI18next)
  .init(getOptions())

export const useTranslation = () => {
  const params = useParams();
  const lang = params?.lang ?? fallbackLang;

  return {
    t: i18next.getFixedT(lang, 'translations'),
    i18n: i18next,
  }
};
