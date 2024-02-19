'use client';

import { Link, useTranslation } from '@/app/i18n/client';
import { Button } from '@/components/Button';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SessionMenu } from '@/components/SessionMenu';
import { HomeIcon } from '@heroicons/react/24/outline';
import { ChevronDoubleRightIcon } from '@heroicons/react/24/solid';
import { Session } from 'next-auth';
import dynamic from 'next/dynamic';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Logo } from './logo';

const DarkModeToggle = dynamic(() => import('@/components/DarkModeToggle'), {
  ssr: false,
});

type Props = {
  session: Session | null;
};

const Header: React.FC<Props> = ({ session }) => {
  const { t } = useTranslation();

  const segment = useSelectedLayoutSegment();

  const showDescription = segment === 'list';

  return (
    <div className="bg-[#FFD54F] dark:bg-[#25231F] p-5 py-3 relative">
      <div className="flex gap-1 -mx-1 items-center">
        <h1 className="text-xl font-semibold items-center ml-3 mr-5 hidden lg:block">
          Job Board
        </h1>
        <Link
          className="flex items-center gap-2 hover:bg-black/10 p-2 rounded cursor-pointer"
          href="/"
        >
          <HomeIcon className="h-5 w-5" />{' '}
          <span className="hidden md:inline">{t('menu.frontPage')}</span>
        </Link>
        <DarkModeToggle />
        <LanguageSelector />
        <div className="flex-grow" />
        <SessionMenu session={session} />
      </div>
      {!showDescription && (
        <h1 className="text-xl font-semibold mb-2 mt-3 flex items-center gap-3 block lg:hidden">
          Job Board
        </h1>
      )}
      {showDescription && (
        <div className="mx-auto md:w-[80ch] flex my-3 lg:my-10 items-center h-full gap-10">
          <div className="h-[12em] shrink-0 hidden lg:block dark:[--logo-color:#ffd54f]">
            <Logo color="black" />
          </div>
          <div>
            <h1 className="text-xl font-semibold mb-2 mt-3 flex items-center gap-3">
              Job Board
            </h1>
            <p>{t('header.description')}</p>
            <div className="flex gap-5 mt-8">
              <Button
                secondary
                icon={<ChevronDoubleRightIcon className="h-5 w-5" />}
                onClick={() => {
                  window.location.assign('https://tko-aly.fi/');
                }}
              >
                {t('header.organizationButton')}
              </Button>
              <Button
                secondary
                icon={<ChevronDoubleRightIcon className="h-5 w-5" />}
                onClick={() => {
                  window.location.assign('https://tko-aly.fi/yrityksille');
                }}
              >
                {t('header.forCompaniesButton')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
