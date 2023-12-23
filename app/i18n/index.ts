import { type i18n, createInstance, Namespace } from 'i18next'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { fallbackLang, getOptions, languages } from '@/app/i18n/settings'
import { useRouter } from 'next/router'

const initI18next = async (lng: string) => {
  const i18nInstance = createInstance()

  await i18nInstance
    .use(initReactI18next)
    .init(getOptions())

  return i18nInstance
}

export async function useTranslation(lng: string) {
  const i18nextInstance = await initI18next(lng)

  return {
    t: i18nextInstance.getFixedT(lng, 'translations'),
    i18n: i18nextInstance
  }
}
