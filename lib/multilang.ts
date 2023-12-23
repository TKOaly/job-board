import { fallbackLang } from "@/app/i18n/settings";
import { useParams } from "next/navigation";

export type LanguageKey = 'fi' | 'en' | 'xx';
export type MultiLangStringSet = Record<LanguageKey, string>;

const LANGUAGE_PREFERENCE: LanguageKey[] = ['fi', 'en', 'xx']

export const getMultiLangStringValue = (value: unknown, pLang: string) => {
  if (typeof value !== 'object' || value === null) {
    return '';
  }

  for (const lang of [pLang, ...LANGUAGE_PREFERENCE]) {
    if (value[lang]) {
      return value[lang];
    }
  }

  return '';
}

export const toMultiLangStringSet = (value: unknown): Record<string, string> => {
  if (value === null) {
    return {};
  }

  if (typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter((value): value is [string, string] => typeof value[0] === 'string' && typeof value[1] === 'string')
    )
  }

  return {}
}

export const useMultiLang = () => {
  const params = useParams();

  let lang: string
  let langParam = params?.lang

  if (!langParam) {
    lang = fallbackLang;
  } else if (Array.isArray(langParam)) {
    lang = langParam[0];
  } else {
    lang = langParam;
  }

  return (stringSet: unknown) => {
    if (typeof stringSet !== 'object' || stringSet === null) {
      return '';
    }

    return stringSet[lang] ?? stringSet['xx'] ?? ''
  }
}
