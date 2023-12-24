'use client'

import i18next from 'i18next'
import { useParams } from 'next/navigation'
import { initReactI18next } from 'react-i18next'
import { fallbackLang, getOptions } from './settings'
import { useRouter as useRouterOrig } from 'next/navigation'
import LinkOrig from 'next/link';
import { forwardRef, ComponentProps } from 'react'

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

export const useRouter = (): ReturnType<typeof useRouterOrig> => {
  const params = useParams(); 
  const router = useRouterOrig();

  let prefix = '';

  if (params?.lang) {
    prefix = `/${params.lang}`;
  }

  return {
    ...router,
    push: (url, options) => router.push(`${prefix}${url}`, options),
    replace: (url, options) => router.replace(`${prefix}${url}`, options),
  }
};

export const Link: React.FC<ComponentProps<typeof LinkOrig>> = forwardRef((props, ref) => {
  const params = useParams(); 

  let href = props.href;

  if (params?.lang) {
    href = `/${params.lang}${href}`;
  }

  return <><LinkOrig {...props} href={href} ref={ref} /></>
});
