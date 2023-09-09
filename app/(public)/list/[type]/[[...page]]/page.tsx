import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon, FaceFrownIcon } from "@heroicons/react/24/outline";
import { Post } from "@prisma/client";
import client from "@/db";
import tsquery from "pg-tsquery";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { ComponentProps, HTMLAttributes } from "react";
import { Button } from "@/components/Button";
import { PostCard } from "@/components/PostCard";
import { Input } from "@/components/Input";
import { Search } from "@/components/Search";
import Card from "@/components/Card";

const getCounts = async ({ search: textSearch }: { search?: string }) => {
  const search = textSearch ? tsquery()(textSearch) : undefined;

  let where: NonNullable<Parameters<typeof client.post.findMany>[0]>['where'] = {
    title: {
      search,
    },
    body: {
      search,
    },
  };
  const open = await client.post.count({
    where: {
      ...where,
      opensAt: { lte: new Date() },
      closesAt: { gte: new Date() },
    },
  });

  const closed = await client.post.count({
    where: {
      ...where,
      OR: [
        { opensAt: { gt: new Date() } },
        { closesAt: { lt: new Date() } },
      ],
    },
  });

  const upcoming = await client.post.count({
    where: {
      ...where,
      opensAt: { gt: new Date() },
    },
  });

  return { upcoming, open, closed };
};

type GetPostsOpts = {
  type: 'open' | 'closed',
  page?: number,
  search?: string,
}

const getPosts = async ({ type, page = 1, search: textSearch }: GetPostsOpts) => {
  const search = textSearch ? tsquery()(textSearch) : undefined;

  let where: NonNullable<Parameters<typeof client.post.findMany>[0]>['where'] = {
    title: {
      search,
    },
    body: {
      search,
    },
  };

  if (type === 'open') {
    where = {
      ...where,
      closesAt: { gte: new Date() },
    };
  } else if (type === 'closed') {
    where = {
      ...where,
      closesAt: { lt: new Date() },
    };
  }

  let skip = ((page ?? 1) - 1) * 10;

  const posts = await client.post.findMany({
    where,
    include: {
      employingCompany: true,
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    skip,
  });

  return posts;
}

type Props = {
  posts: Post[],
};

type ChipProps = {
  label: string
  count: number
  active: boolean
  onClick?: HTMLAttributes<HTMLDivElement>['onClick']
};

const chipCva = cva([
  'text-sm',
  'text-black',
  'shadow-sm',
  'inline-block',
  'py-1',
  'px-3',
  'rounded-full',
  'border',
], {
  variants: {
    active: {
      true: [
        'bg-[#FFD54F]',
        'dark:bg-[#b7962e]',
        'border-[rgb(247,205,74)]',
        'dark:border-[#b7962e]',
      ],
      false: [
        'bg-white',
        'dark:bg-[#a6a29a]',
        'border-gray-200',
        'dark:border-[#a6a29a]',
      ],
    },
  },
});

const Chip = ({ label, count, active, onClick }: ChipProps) => (
  <div className={chipCva({ active })} onClick={onClick}>
    <span>{label}</span>
    <span className="ml-2">{count}</span>
  </div>
);

const ListPage = async ({ params, searchParams }) => {
  const search = searchParams.search ? searchParams.search.toString() : undefined;

  const type = params.type;
  const page: number = parseInt(params.page?.[0] ?? '1', 10);
  const { upcoming, open, closed } = await getCounts({ search });
  const posts = await getPosts({ type, page, search });

  return (
    <div>
      <div className="flex gap-2 mt-10 px-10 justify-center">
        <Search type={type} initialSearch={search} />
      </div>
      <div className="mb-10 mt-5 flex gap-3 justify-center">
        <Link href={`/list/open/1?search=${encodeURIComponent(search)}`}>
          <Chip label="Tulevat ja avoimet" count={open + upcoming} active={params.type === 'open'} />
        </Link>
        <Link href={`/list/closed/1?search=${encodeURIComponent(search)}`}>
          <Chip label="Päättyneet" count={closed} active={params.type === 'closed'} />
        </Link>
      </div>
      {posts.length > 0 && (
        <div className="mx-4">
          {posts.map((post) => <PostCard key={post.id} post={post} company={post.employingCompany!} className="mt-5" />)}
        </div>
      )}
      {posts.length === 0 && (
        <Card className="mx-5">
          <h3 className="text-xl flex items-center">Pahus, ei avoimia ilmoituksia. <FaceFrownIcon className="h-8 w-8 ml-2" /></h3>
          <p className="mt-5">
            Voit saada tiedon uusista ilmoituksista liittymällä TKO-älyn tiedotuskanavalle Telegramissa tai liittymällä rekry-sähköpostilistalle.
          </p>
          <div className="flex gap-3 mt-10">
            <Link href="https://t.me/Tekis2023">
              <Button secondary icon={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}>Telegram</Button>
            </Link>
            <Link href="https://www.tko-aly.fi/yhdistys/tiedotus">
              <Button secondary icon={<ArrowTopRightOnSquareIcon className="h-4 w-4" />}>Sähköpostilistat</Button>
            </Link>
          </div>
        </Card>
      )}
      <div className="flex justify-center mt-5 gap-5 mb-10">
        {page > 1 && (
          <Link href={`/list/${type}/${page - 1}?search=${encodeURIComponent(search)}`}>
            <Button secondary><ChevronLeftIcon className="w-5 h-5 -mx-1" />Edellinen</Button>
          </Link>
        )}
        { posts.length === 10 && (
          <Link href={`/list/${type}/${page + 1}?search=${encodeURIComponent(search)}`}>
            <Button secondary>Seuraava <ChevronRightIcon className="w-5 h-5 -ml-1" /></Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ListPage;
