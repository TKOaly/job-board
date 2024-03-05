'use client';

import {
  ArrowTopRightOnSquareIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import { Company } from '@/lib/companies';
import { Link } from '@/app/i18n/client';
import Card, { CardField } from './Card';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { useMultiLang } from '@/lib/multilang';
import { useTranslation } from '@/app/i18n/client';

export type Props = {
  companies: Company[];
  editable?: boolean;
};

export const CompanyList = ({ companies }: Props) => {
  const getMultiLangValue = useMultiLang();
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      {companies.map(company => (
        <Card key={company.id} className="relative">
          <Link href={`/admin/companies/${company.id}/edit`}>
            <PencilSquareIcon className="h-5 w-5 absolute top-4 right-4 text-yellow-600 hover:text-yellow-800" />
            <p className="sr-only">{t('company.edit')}</p>
          </Link>

          <Link href={`/companies/${company.id}`}>
            <h1 className="text-xl font-bold">
              {getMultiLangValue(company.name)}
              {company.partner && (
                <span className="text-sm ml-2 rounded py-0.5 px-1.5 bg-yellow-100 text-yellow-700 inline-flex items-center gap-1">
                  <SparklesIcon className="h-4 w-4" />
                  {t('partner')}
                </span>
              )}
            </h1>
          </Link>

          <div className="flex gap-y-2 gap-x-8">
            <CardField label={t('company.postings')}>
              {company.employerPostCount}
            </CardField>

            {company.website && (
              <CardField label={t('company.website')}>
                <Link
                  href={company.website}
                  className="flex items-center gap-1 text-blue-500"
                >
                  {company.website}
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </Link>
              </CardField>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};
