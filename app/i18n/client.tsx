'use client'

import i18next from 'i18next'
import { useParams, usePathname, useSelectedLayoutSegments } from 'next/navigation'
import { initReactI18next } from 'react-i18next'
import { fallbackLang, getOptions, languages } from './settings'
import { useRouter as useRouterOrig } from 'next/navigation'
import LinkOrig from 'next/link';
import { forwardRef, ComponentProps } from 'react'
import { Url } from 'next/dist/shared/lib/router/router'

i18next
  .use(initReactI18next)
  .init(getOptions())

export const useTranslation = () => {
  const params = useParams();
  const lang = params?.lang ?? fallbackLang;

  return {
    t: i18next.getFixedT(lang, 'translations'),
    i18n: i18next,
    lang,
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

export const Link: React.FC<Omit<ComponentProps<typeof LinkOrig>, 'href'> & { href?: ComponentProps<typeof LinkOrig>['href'], lang?: string }> = forwardRef((props, ref) => {
  const pathname = usePathname();
  const params = useParams(); 
  
  let href: string | Url

  if (props.href) {
    href = props.href;
  } else if (params?.lang && pathname) {
    href = '/' + pathname.split('/').slice(2).join('/');
  } else if (pathname) {
    href = pathname;
  } else {
    href = '/';
  }

  let lang = props.lang ?? params?.lang;

  const resolvedHref = new URL(href.toString(), document.baseURI)
  const isSameOrigin = new URL(document.baseURI).origin === resolvedHref.origin;

  if (isSameOrigin && lang) {
    if (!languages.some((lang) => resolvedHref.pathname.startsWith(`/${lang}`))) {
      resolvedHref.pathname = `/${lang}${resolvedHref.pathname}`;
    }
  }

  return <LinkOrig {...props} href={resolvedHref} ref={ref} />
});
