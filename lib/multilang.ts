export type LanguageKey = 'fi' | 'en' | 'xx';
export type MultiLangStringSet = Record<LanguageKey, string>;

const LANGUAGE_PREFERENCE: LanguageKey[] = ['fi', 'en', 'xx']

export const getMultiLangStringValue = (value: MultiLangStringSet) => {
  for (const lang of LANGUAGE_PREFERENCE) {
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

