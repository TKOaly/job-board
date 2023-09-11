import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useDarkMode } from './DarkModeProvider';

export default function DarkModeToggle() {
  const [dark, setDark] = useDarkMode();

  return (
    <div
      onClick={() => setDark(!dark)}
      className="flex items-center gap-2 hover:bg-black/10 p-2 rounded cursor-pointer"
    >
      {dark && (
        <>
          <SunIcon className="h-5 w-5" />{' '}
          <span className="hidden md:inline">Light mode</span>
        </>
      )}
      {!dark && (
        <>
          <MoonIcon className="h-5 w-5" />{' '}
          <span className="hidden md:inline">Dark mode</span>
        </>
      )}
    </div>
  );
}
