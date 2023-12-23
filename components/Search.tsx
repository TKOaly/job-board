'use client';

import { Input } from '@/components/Input';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslation } from '@/app/i18n/client';
import { Button } from './Button';

type Props = {
  initialSearch?: string;
  type: 'closed' | 'open';
};

export const Search = ({ type, initialSearch = '' }: Props) => {
  const { push } = useRouter();
  const { t } = useTranslation();

  const [search, setSearch] = useState(initialSearch);

  const submit = () => {
    push(
      `/list/${encodeURIComponent(type)}/1?search=${encodeURIComponent(
        search,
      )}`,
    );
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = evt => {
    if (evt.key == 'Enter') {
      submit();
    }
  };

  return (
    <>
      <Input
        value={search}
        onKeyDown={onKeyDown}
        onChange={evt => setSearch(evt.target.value)}
        className="h-9 max-w-[30ch]"
        placeholder={t('search.placeholder')}
      />
      <Button onClick={submit}>{t('search.button')}</Button>
    </>
  );
};
