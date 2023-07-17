'use client';

import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { Company, Post } from "@prisma/client";
import { format, isAfter, isBefore } from "date-fns";
import { useRouter } from "next/navigation";
import sanitize from "sanitize-html";
import { Button } from "../../../components/Button";

export type Props = {
  post: Post,
  company: Company,
};

const PostDetails = ({ post, company }: Props) => {
  const { back } = useRouter();

  let isOpen = true;

  if (post.opensAt) {
    isOpen = isOpen && isAfter(new Date(), post.opensAt);
  }

  if (post.closesAt) {
    isOpen = isOpen && isBefore(new Date(), post.closesAt);
  }

  return (
    <div>
      <Button className="mt-5" onClick={() => back()}>
        <ChevronLeftIcon className="h-5 w-5 -mr-1 -ml-1" />
        Takaisin
      </Button>
      <div className="bg-white shadow rounded border mt-5 p-10">
        <div className="flex">
          <div className="grow">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <span className="text-xl">{company.name}</span>

            <div className="my-3">
              <span className="text-xs text-gray-600 uppercase font-bold">Hakuaika</span>
              <div className="flex items-center gap-3">
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
          </div>

          { company.partner && company.logoUrl && (
            <div className="w-[10rem] h-[7rem] rounded bg-gray-100 text-gray-500 text-xl flex items-center justify-center" style={{ backgroundImage: `url(${company.logoUrl})` }}></div>
          )}
        </div>

        <div className="mt-10 mb-5 border-t h-4 -mx-10 overflow-hidden shadow-[0px_10px_10px_-10px_#0000000a_inset]"></div>

        <div className="post-body" dangerouslySetInnerHTML={{ __html: sanitize(post.body) }}></div>
      </div>
    </div>
  );
}

export default PostDetails;
