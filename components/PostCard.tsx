'use client';

import { SparklesIcon } from '@heroicons/react/20/solid';
import { Post, Tag } from '@prisma/client';
import { Company } from '@/lib/companies';
import { format, isAfter, isBefore, isWithinInterval } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApplicationOpenBadge } from './ApplicationOpenBadge';
import { Button } from './Button';
import Card, { CardField } from './Card';
import { PartnerBadge } from './PartnerBadge';
import { TagBadge } from './TagBadge';
import { PencilIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export type Props = {
  post: Post & { tags: Tag[] };
  company: Company;
  className?: string;
  editable?: boolean;
};

export const PostCard = ({ post, company, className, editable }: Props) => {
  const { push } = useRouter();

  let isOpen = true;

  if (post.opensAt) {
    isOpen = isOpen && isAfter(new Date(), post.opensAt);
  }

  if (post.closesAt) {
    isOpen = isOpen && isBefore(new Date(), post.closesAt);
  }

  return (
    <Card className={className}>
      <div className="flex relative">
        {editable && (
          <Link href={`/admin/posts/${post.id}/edit`}>
            <PencilSquareIcon className="h-5 w-5 absolute top-0 right-0 text-yellow-600 hover:text-yellow-800" />
            <p className="sr-only">Muokkaa</p>
          </Link>
        )}
        <div className="grow">
          {company.partner && company.logoUrl && (
            <div
              className="w-[10rem] float-right h-[7rem] text-gray-500 text-xl flex items-center justify-center bg-center bg-no-repeat bg-contain bg-transparent"
              style={{ backgroundImage: `url('${company.logoUrl}')` }}
            ></div>
          )}
          <Link href={`/posts/${post.id}`}>
            <h3 className="text-xl font-bold grow">{post.title}</h3>
          </Link>
          <CardField label="Ilmoittaja">
            <Link href={`/companies/${company.id}`}>{company.name}</Link>
            {company.partner && <PartnerBadge />}
          </CardField>
          <CardField label="Ilmoitus jätetty">
            <div suppressHydrationWarning>
              {format(post.createdAt, 'dd.MM.yyyy')}
            </div>
          </CardField>
          <CardField label="Hakuaika">
            <div suppressHydrationWarning>
              {post.opensAt ? format(post.opensAt, 'dd.MM.yyyy') : ''} &ndash;{' '}
              {post.closesAt ? format(post.closesAt, 'dd.MM.yyyy') : ''}
              {isOpen && <ApplicationOpenBadge className="ml-2" />}
            </div>
          </CardField>
          {post.tags.length > 0 && (
            <CardField label="Tunnisteet">
              <div className="mt-1 flex flex-wrap gap-1">
                {post.tags.map(tag => (
                  <TagBadge key={tag.id}>{tag.name}</TagBadge>
                ))}
              </div>
            </CardField>
          )}
          <Button onClick={() => push(`/posts/${post.id}`)} className="mt-5">
            Lue lisää
          </Button>
        </div>
      </div>
    </Card>
  );
};
