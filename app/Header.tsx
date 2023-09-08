'use client';

import { UserCircleIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { Logo } from "./logo";

type Props = {
  session: Session | null
}

const Header: React.FC<Props> = ({ session }) => {
  const { push } = useRouter();

  return (
    <div className="bg-[#FFD54F] min-h-[20em] p-10 relative">
      <div className="mx-auto w-[80ch] flex items-center h-full gap-10">
        <div className="h-[12em] shrink-0">
          <Logo color="black" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-3 flex items-center gap-3">
            Job Board
          </h1>
          <p>
            Job Board on TKO-äly ry:n tarjoama Helsingin Yliopiston tietojenkäsittely- ja datatieteen opiskelijoille suunnattu sivusto, jossa alan yritykset voivat ilmoittaa avoimista työpaikoista.
            Sivusto tavoittaa 900 Helsingin Yliopiston opiskelijaa ja välittää ilmoituksia niin TKO-älyn yhteistöykumppaneilta kuin ulkopuolisiltakin yrityksiltä.
          </p>
          <div className="flex gap-5 mt-5">
            <Button secondary icon={<ChevronDoubleRightIcon className="h-5 w-5" />} onClick={() => push('https://tko-aly.fi/')}>Yhdistys</Button>
            <Button secondary icon={<ChevronDoubleRightIcon className="h-5 w-5" />} onClick={() => window.location.replace('https://tko-aly.fi/yrityksille')}>Yrityksille</Button>
          </div>
        </div>
      </div>
      { !session && (
        <ArrowLeftOnRectangleIcon
          style={{ transform: 'scale(-1,1)' }}
          className="h-10 w-10 flip absolute top-0 right-0 m-5 hover:bg-black/10 p-2 rounded"
          onClick={() => signIn('tkoaly')}
        />
      )}
      { session && (
        <div className="absolute top-0 right-0 m-5 flex items-center gap-2">
          <div className="hover:bg-black/10 p-2 rounded flex items-center gap-2">
            <UserCircleIcon className="h-6 w-6" />
            {session.user?.name}
          </div>
          <Link href="/admin">
            <Cog6ToothIcon className="h-10 w-10 flip hover:bg-black/10 p-2 rounded" />
          </Link>
          <ArrowRightOnRectangleIcon
            className="h-10 w-10 flip hover:bg-black/10 p-2 rounded"
            onClick={() => signOut()}
          />
        </div>
      )}
    </div>
  );
};

export default Header;
