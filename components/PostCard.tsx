'use client';

import { SparklesIcon } from '@heroicons/react/20/solid';
import { Company, Post, Tag } from '@prisma/client';
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
          <h3 className="text-xl font-bold">{post.title}</h3>
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
              {isOpen && <ApplicationOpenBadge className="ml-0.5" />}
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
        {company.partner && company.logoUrl && (
          <div
            className="w-[10rem] h-[7rem] rounded bg-gray-100 text-gray-500 text-xl flex items-center justify-center"
            style={{ backgroundImage: `url(${company.logoUrl})` }}
          ></div>
        )}
      </div>
    </Card>
  );
};
