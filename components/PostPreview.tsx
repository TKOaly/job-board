'use client';

import { Post, Tag } from '@/lib/db/schema';
import { Company } from '@/lib/companies';
import { format, isAfter, isBefore, isSameDay } from 'date-fns';
import { ApplicationOpenBadge } from './ApplicationOpenBadge';
import { Button } from './Button';
import Card, { CardField } from './Card';
import { PartnerBadge } from './PartnerBadge';
import { TagBadge } from './TagBadge';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Link, useRouter, useTranslation } from '@/app/i18n/client';
import { useMultiLang } from '@/lib/multilang';

export type Props = {
  post: Post & { tags: Tag[] };
  company: Company;
  className?: string;
  editable?: boolean;
};

export const PostPreview = ({ post, company, className, editable }: Props) => {
  const { t } = useTranslation();
  const getMultiLangValue = useMultiLang();
  const { push } = useRouter();

  let isOpen = true;

  if (post.opensAt) {
    isOpen =
      isOpen &&
      (isAfter(new Date(), post.opensAt) ||
        isSameDay(new Date(), post.opensAt));
  }

  if (post.closesAt) {
    isOpen =
      isOpen &&
      (isBefore(new Date(), post.closesAt) ||
        isSameDay(new Date(), post.closesAt));
  }

  return (
    <Card className={className}>
      <div className="flex relative">
        {editable && (
          <Link href={`/admin/posts/${post.id}/edit`}>
            <PencilSquareIcon className="h-5 w-5 absolute top-0 right-0 text-yellow-600 hover:text-yellow-800" />
            <p className="sr-only">{t('post.edit')}</p>
          </Link>
        )}
        <div className="grow flex flex-wrap gap-y-2 gap-x-8">
          {company.partner && company.logoUrl && (
            <div
              className="w-[10rem] h-[7rem] text-gray-500 text-xl flex items-center justify-center bg-center bg-no-repeat bg-contain bg-transparent absolute right-6"
              style={{ backgroundImage: `url('${company.logoUrl}')` }}
            />
          )}
          <Link href={`/posts/${post.id}`} className="w-full">
            <h3 className="text-xl font-bold grow">
              {getMultiLangValue(post.title)}
            </h3>
          </Link>
          <CardField label={t('post.submittedBy')}>
            <Link href={`/companies/${company.id}`}>
              {getMultiLangValue(company.name)}
            </Link>
            {company.partner && <PartnerBadge />}
          </CardField>
          <CardField label={t('post.submittedAt')}>
            <div suppressHydrationWarning>
              {format(post.createdAt, 'dd.MM.yyyy')}
            </div>
          </CardField>
          <CardField label={t('post.closesAt')}>
            <div suppressHydrationWarning>
              {post.closesAt ? format(post.closesAt, 'dd.MM.yyyy') : ''}
            </div>
          </CardField>
        </div>
      </div>
    </Card>
  );
};
