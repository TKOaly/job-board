'use client';

import { Company } from '@/lib/companies';
import {
  ChevronLeftIcon,
  PencilSquareIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/20/solid';
import { useSession } from 'next-auth/react';
import { Post } from '@/lib/posts';
import { Button } from './Button';
import Card from './Card';
import { PostCard } from './PostCard';
import { useMultiLang } from '@/lib/multilang';
import { Link, useRouter, useTranslation } from '@/app/i18n/client';

type Props = {
  company: Company;
  posts: Post[],
};

export const CompanyDetails = ({ company, posts }: Props) => {
  const { t } = useTranslation()
  const { back, push } = useRouter();
  const getMultiLangValue = useMultiLang();
  const session = useSession();
  const admin = !!session?.data?.user?.admin;

  return (
    <div>
      <div className="flex items-center mt-5 gap-3">
        <Button onClick={() => back()}>
          <ChevronLeftIcon className="h-5 w-5 -mr-1 -ml-1" />
          {t('company.back')}
        </Button>
        {admin && (
          <>
            <div className="grow" />
            <Button
              secondary
              onClick={() => push(`/admin/companies/${company.id}/edit`)}
            >
              {t('company.edit')} <PencilSquareIcon className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <Card className="mt-5">
        <div className="flex">
          <div className="grow">
            <h1 className="text-3xl font-bold">
              {getMultiLangValue(company.name)}
              {company.partner && (
                <span className="text-sm ml-2 rounded py-0.5 px-1.5 bg-yellow-100 text-yellow-700 inline-flex items-center gap-1">
                  <SparklesIcon className="h-4 w-4" />
                  {t('partner')}
                </span>
              )}
            </h1>
            {company.website && (
              <div className="my-3">
                <span className="text-xs text-gray-600 uppercase font-bold">
                  {t('company.website')}
                </span>
                <div suppressHydrationWarning>
                  <Link
                    href={company.website}
                    className="flex items-center gap-1 text-blue-500"
                  >
                    {company.website}
                    <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
          {company.partner && company.logoUrl && (
            <div
              className="w-[10rem] h-[7rem] text-gray-500 text-xl flex items-center justify-center bg-center bg-no-repeat bg-contain bg-transparent"
              style={{ backgroundImage: `url('${company.logoUrl}')` }}
            ></div>
          )}
        </div>
      </Card>
      <h2 className="text-2xl font-bold mt-10">{t('company.postings')}</h2>
      {posts.map(post => (
        <PostCard
          post={post}
          company={company}
          className="mt-5"
          key={post.id}
        />
      ))}
    </div>
  );
};
