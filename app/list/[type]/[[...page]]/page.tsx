import { ArrowTopRightOnSquareIcon } from "@heroicons/react/20/solid";
import { ChevronLeftIcon, ChevronRightIcon, FaceFrownIcon } from "@heroicons/react/24/outline";
import { Post, PrismaClient } from "@prisma/client";
import { cva } from "class-variance-authority";
import Link from "next/link";
import { ComponentProps, HTMLAttributes } from "react";
import { Button } from "../../../../components/Button";
import { PostCard } from "../../../../components/PostCard";

const getCounts = async () => {
  const client = new PrismaClient();

  const open = await client.post.count({
    where: {
      opensAt: { lte: new Date() },
      closesAt: { gte: new Date() },
    },
  });

  const closed = await client.post.count({
    where: {
      OR: [
        { opensAt: { gt: new Date() } },
        { closesAt: { lt: new Date() } },
      ],
    },
  });

  const upcoming = await client.post.count({
    where: {
      opensAt: { gt: new Date() },
    },
  });

  return { upcoming, open, closed };
};


const getPosts = async (type: 'open' | 'closed', page: number = 1) => {
  const prisma = new PrismaClient();

  let where = undefined;

  if (type === 'open') {
    where = {
      closesAt: { gte: new Date() },
    };
  } else if (type === 'closed') {
    where = {
      closesAt: { lt: new Date() },
    };
  }

  let skip = ((page ?? 1) - 1) * 10;

  const posts = await prisma.post.findMany({
    where,
    include: {
      employingCompany: true,
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
  onClick: HTMLAttributes<HTMLDivElement>['onClick']
};

const chipCva = cva([
  'text-sm',
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
        'border-[rgb(247,205,74)]',
      ],
      false: [
        'bg-white',
        'border-gray-200',
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

const ListPage = async ({ params }) => {
  const type = params.type;
  const page: number = parseInt(params.page?.[0] ?? '1', 10);
  const { upcoming, open, closed } = await getCounts();
  const posts = await getPosts(type, page);

  return (
    <div>
      <div className="my-10 flex gap-3 justify-center">
        <Link href="/list/open/1">
          <Chip label="Tulevat ja avoimet" count={open + upcoming} active={params.type === 'open'} />
        </Link>
        <Link href="/list/closed/1">
          <Chip label="Päättyneet" count={closed} active={params.type === 'closed'} />
        </Link>
      </div>
      {posts.length > 0 && posts.map((post) => <PostCard key={post.id} post={post} company={post.employingCompany} />)}
      {posts.length === 0 && (
        <div className="mx-auto border border-gray-200 rounded bg-white shadow">
          <div className="p-5">
            <h3 className="text-xl text-gray-800 flex items-center">Pahus, ei avoimia ilmoituksia. <FaceFrownIcon className="h-8 w-8 ml-2" /></h3>
            <p className="text-gray-800 mt-5">
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
          </div>
          <div className="h-3 bg-[#FFD54F] rounded-b-md border-yellow-400 border-x border-b"></div>
        </div>
      )}
      <div className="flex justify-center mt-5 gap-5 mb-10">
        {page > 1 && (
          <Link href={`/list/${type}/${page - 1}`}>
            <Button secondary><ChevronLeftIcon className="w-5 h-5 -mx-1" />Edellinen</Button>
          </Link>
        )}
        { posts.length === 10 && (
          <Link href={`/list/${type}/${page + 1}`}>
            <Button secondary>Seuraava <ChevronRightIcon className="w-5 h-5 -ml-1" /></Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ListPage;
