'use client';

import { SparklesIcon } from "@heroicons/react/20/solid";
import { Company, Post, Tag } from "@prisma/client";
import { format, isAfter, isBefore, isWithinInterval } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ApplicationOpenBadge } from "./ApplicationOpenBadge";
import { Button } from "./Button";
import Card, { CardField } from "./Card";
import { PartnerBadge } from "./PartnerBadge";

export type Props = {
  post: Post & { tags: Tag[] },
  company: Company,
  className?: string
}

export const PostCard = ({ post, company, className }: Props) => {
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
      <div className="flex">
        <div className="grow">
          <h3 className="text-xl font-bold">{post.title}</h3>
          <CardField label="Ilmoittaja">
            <Link href={`/companies/${company.id}`}>{company.name}</Link>
            {company.partner && <PartnerBadge />}
          </CardField>
          <CardField label="Ilmoitus jätetty">
            <div suppressHydrationWarning>{format(post.createdAt, 'dd.MM.yyyy')}</div>
          </CardField>
          <CardField label="Hakuaika">
            {post.opensAt ? format(post.opensAt, 'dd.MM.yyyy') : ''} &ndash; {post.closesAt ? format(post.closesAt, 'dd.MM.yyyy') : ''} 
            { isOpen && <ApplicationOpenBadge className="ml-0.5" /> }
          </CardField>
          {post.tags.length > 0 && (
            <CardField label="Tunnisteet">
              <div className="mt-1">
                {post.tags.map((tag) => (
                  <span className="text-sm rounded py-0.5 px-1.5 bg-gray-100 text-gray-700 dark:bg-[#464542] dark:text-gray-300 inline-flex items-center gap-1" key={tag.id}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </CardField>
          )}
          <Button onClick={() => push(`/posts/${post.id}`)} className="mt-5">Lue lisää</Button>
        </div>
        { company.partner && company.logoUrl && (
          <div className="w-[10rem] h-[7rem] rounded bg-gray-100 text-gray-500 text-xl flex items-center justify-center" style={{ backgroundImage: `url(${company.logoUrl})` }}></div>
        )}
      </div>
    </Card>
  );
};
