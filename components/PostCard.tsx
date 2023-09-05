'use client';

import { SparklesIcon } from "@heroicons/react/20/solid";
import { Company, Post, Tag } from "@prisma/client";
import { format, isAfter, isBefore, isWithinInterval } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./Button";
import Card from "./Card";

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
          <div className="my-3">
            <span className="text-xs text-gray-600 uppercase font-bold">Ilmoittaja</span>
            <div className="flex items-center gap-2">
              <Link href={`/companies/${company.id}`}>{company.name}</Link>
              {company.partner && (
                <span className="text-sm rounded py-0.5 px-1.5 bg-yellow-100 text-yellow-700 inline-flex items-center gap-1">
                  <SparklesIcon className="h-4 w-4" />
                  Yhteistökumppani
                </span>
              )}
            </div>
          </div>
          <div className="my-3">
            <span className="text-xs text-gray-600 uppercase font-bold">Ilmoitus jätetty</span>
            <div suppressHydrationWarning>{format(post.createdAt, 'dd.MM.yyyy')}</div>
          </div>
          <div className="my-3">
            <span className="text-xs text-gray-600 uppercase font-bold">Hakuaika</span>
            <div suppressHydrationWarning className="flex items-center gap-3">
              {post.opensAt ? format(post.opensAt, 'dd.MM.yyyy') : ''} &ndash; {post.closesAt ? format(post.closesAt, 'dd.MM.yyyy') : ''} 
              { isOpen && (
                <span className="text-sm rounded py-0.5 px-1.5 bg-green-50 text-green-600 inline-flex items-center gap-1">
                  <div className="w-1.5 h-1.5 relative">
                    <div className="absolute animate-ping rounded-full bg-green-500 w-full h-full"></div>
                    <div className="rounded-full bg-green-400 w-full h-full"></div>
                  </div>
                  Haku auki
                </span>
              )}
            </div>
          </div>
          {post.tags.length > 0 && (
            <div className="my-3">
              <span className="text-xs text-gray-600 uppercase font-bold">Tunnisteet</span>
              <div suppressHydrationWarning className="flex items-center gap-2 mt-1 flex-wrap">
                {post.tags.map((tag) => (
                  <span className="text-sm rounded py-0.5 px-1.5 bg-gray-100 text-gray-700 inline-flex items-center gap-1" key={tag.id}>
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
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
