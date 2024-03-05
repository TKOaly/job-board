import { ComponentProps, forwardRef } from 'react';
import { type i18n, createInstance, Namespace } from 'i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { fallbackLang, getOptions, languages } from '@/app/i18n/settings';
import { useRouter as useRouterOrig } from 'next/navigation';
import LinkOrig from 'next/link';

const initI18next = async (lng: string) => {
  const i18nInstance = createInstance();

  await i18nInstance.use(initReactI18next).init(getOptions());

  return i18nInstance;
};

export async function useTranslation(lng: string) {
  const i18nextInstance = await initI18next(lng);

  return {
    t: i18nextInstance.getFixedT(lng, 'translations'),
    i18n: i18nextInstance,
  };
}

export const useRouter = (lng: string): ReturnType<typeof useRouterOrig> => {
  const router = useRouterOrig();

  return {
    ...router,
    push: (url, options) => router.push(`/${lng}${url}`, options),
    replace: (url, options) => router.replace(`/${lng}${url}`, options),
  };
};

export const Link: React.FC<
  ComponentProps<typeof LinkOrig> & { lang: string }
> = forwardRef(function Link(props, ref) {
  return <LinkOrig {...props} href={`/${props.lang}${props.href}`} ref={ref} />;
});
