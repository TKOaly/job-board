'use client';

import {
  ChevronLeftIcon,
  TrashIcon,
  PencilSquareIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import { Company } from '@/lib/companies';
import { Post } from '@/lib/posts';
import { format, isAfter, isBefore } from 'date-fns';
import { useRouter } from 'next/navigation';
import sanitize from 'sanitize-html';
import { Button } from '@/components/Button';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Card, { CardField } from '@/components/Card';
import { PartnerBadge } from '@/components/PartnerBadge';
import { ApplicationOpenBadge } from '@/components/ApplicationOpenBadge';
import { TagBadge } from '@/components/TagBadge';

export type Props = {
  post: Post;
  company: Company;
};

const PostDetails = ({ post, company }: Props) => {
  const { back, push } = useRouter();
  const session = useSession();

  const admin = !!session?.data?.user?.admin;

  let isOpen = true;

  if (post.opensAt) {
    isOpen = isOpen && isAfter(new Date(), post.opensAt);
  }

  if (post.closesAt) {
    isOpen = isOpen && isBefore(new Date(), post.closesAt);
  }

  const handleDelete = async () => {
    const result = await fetch(`/api/posts/${post.id}`, {
      method: 'DELETE',
    });

    if (result.ok) {
      push('/');
    }
  };

  return (
    <div>
      <div className="flex items-center mt-5 gap-3">
        <Button onClick={() => back()}>
          <ChevronLeftIcon className="h-5 w-5 -mr-1 -ml-1" />
          Takaisin
        </Button>
        {admin && (
          <>
            <div className="grow" />
            <Button
              secondary
              onClick={() => push(`/admin/posts/${post.id}/edit`)}
            >
              Muokkaa <PencilSquareIcon className="h-4 w-4" />
            </Button>
            <Button secondary onClick={handleDelete}>
              Poista <TrashIcon className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <Card className="mt-5">
        <div className="flex">
          <div className="grow">
            {company.partner && company.logoUrl && (
              <div
                className="w-[10rem] float-right h-[7rem] text-gray-500 text-xl flex items-center justify-center bg-center bg-no-repeat bg-contain bg-transparent"
                style={{ backgroundImage: `url('${company.logoUrl}')` }}
              ></div>
            )}

            <h1 className="text-3xl font-bold">{post.title}</h1>

            <div className="flex clear-both flex-col md:flex-row items-start md:items-center gap-2 mt-2">
              <span className="text-xl">
                <Link href={`/companies/${company.id}`}>{company.name}</Link>
              </span>
              {company.partner && <PartnerBadge />}
            </div>

            <CardField label="Hakuaika">
              {post.opensAt ? format(post.opensAt, 'dd.MM.yyyy') : ''} &ndash;{' '}
              {post.closesAt ? format(post.closesAt, 'dd.MM.yyyy') : ''}
              {isOpen && <ApplicationOpenBadge />}
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
          </div>
        </div>

        <div className="mt-10 mb-5 border-t dark:border-[#35322b] h-4 -mx-5 overflow-hidden shadow-[0px_10px_10px_-10px_#0000000a_inset]"></div>

        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: sanitize(post.body) }}
        ></div>
      </Card>
    </div>
  );
};

export default PostDetails;
