import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTranslation } from '@/app/i18n/client';
import { useDarkMode } from './DarkModeProvider';

export default function DarkModeToggle() {
  const [dark, setDark] = useDarkMode();
  const { t } = useTranslation();

  return (
    <div
      onClick={() => setDark(!dark)}
      className="flex items-center gap-2 hover:bg-black/10 p-2 rounded cursor-pointer"
    >
      {dark && (
        <>
          <SunIcon className="h-5 w-5" />{' '}
          <span className="hidden md:inline">{t('lightMode')}</span>
        </>
      )}
      {!dark && (
        <>
          <MoonIcon className="h-5 w-5" />{' '}
          <span className="hidden md:inline">{t('darkMode')}</span>
        </>
      )}
    </div>
  );
}
