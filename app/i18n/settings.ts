import enTranslations from '@/locales/en.yaml'
import fiTranslations from '@/locales/fi.yaml'
import { InitOptions } from 'i18next'

export const cookieName = 'jobs-lang'
export const languages = ['en', 'fi']
export const fallbackLang = 'en'

const runsOnServerSide = typeof window === 'undefined'

export const getOptions = (): InitOptions => ({
  supportedLngs: languages,
  fallbackLng: fallbackLang,
  preload: runsOnServerSide ? languages : [],
  resources: {
    en: { translations: enTranslations },
    fi: { translations: fiTranslations }
  },
})
