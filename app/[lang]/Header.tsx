'use client';

import { UserCircleIcon, Cog6ToothIcon, LanguageIcon } from '@heroicons/react/24/outline';
import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/solid';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { Logo } from './logo';
import dynamic from 'next/dynamic';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useTranslation } from '@/app/i18n/client';

const DarkModeToggle = dynamic(() => import('@/components/DarkModeToggle'), {
  ssr: false,
});

type Props = {
  session: Session | null;
};

const Header: React.FC<Props> = ({ session }) => {
  const { t, i18n } = useTranslation();

  console.log(i18n)

  const { push } = useRouter();

  return (
    <div className="bg-[#FFD54F] dark:bg-[#25231F] min-h-[20em] p-10 pt-3 relative">
      <div className="flex justify-between mb-3 -mx-5">
        <div className="flex gap-5">
          <DarkModeToggle />
          <LanguageSelector />
        </div>
        {session && (
          <div className="flex items-center gap-2">
            <div className="hover:bg-black/10 p-2 rounded flex items-center gap-2">
              <UserCircleIcon className="h-6 w-6" />
              {session.user?.name}
            </div>
            <Link href="/admin">
              <Cog6ToothIcon className="h-10 w-10 flip hover:bg-black/10 p-2 rounded" />
            </Link>
            <ArrowRightOnRectangleIcon
              className="h-10 w-10 flip hover:bg-black/10 p-2 rounded cursor-pointer"
              onClick={() => signOut()}
            />
          </div>
        )}
        {!session && (
          <ArrowLeftOnRectangleIcon
            style={{ transform: 'scale(-1,1)' }}
            className="h-10 w-10 flip hover:bg-black/10 p-2 rounded cursor-pointer"
            onClick={() => signIn('tkoaly')}
          />
        )}
      </div>
      <div className="mx-auto md:w-[80ch] flex items-center h-full gap-10">
        <div className="h-[12em] shrink-0 hidden md:block dark:[--logo-color:#ffd54f]">
          <Logo color="black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-3 flex items-center gap-3">
            Job Board
          </h1>
          <p>
            {t('header.description')}
          </p>
          <div className="flex gap-5 mt-8">
            <Button
              secondary
              icon={<ChevronDoubleRightIcon className="h-5 w-5" />}
              onClick={() => push('https://tko-aly.fi/')}
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
    </div>
  );
};

export default Header;
