'use client';

import { useDarkMode } from "@/components/DarkModeProvider";
import { UserCircleIcon, Cog6ToothIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "../components/Button";
import { Logo } from "./logo";

type Props = {
  session: Session | null
}

const Header: React.FC<Props> = ({ session }) => {
  const { push } = useRouter();
  const [dark, setDark] = useDarkMode();

  return (
    <div className="bg-[#FFD54F] dark:bg-[#25231F] min-h-[20em] p-10 pt-3 relative">
      <div className="flex justify-between mb-3 -mx-5">
        <div onClick={() => setDark(!dark)} className="flex items-center gap-2 hover:bg-black/10 p-2 rounded cursor-pointer">
          { dark && (
            <>
              <SunIcon className="h-5 w-5" /> <span className="hidden md:inline">Light mode</span>
            </>
          ) }
          { !dark && (
            <>
              <MoonIcon className="h-5 w-5" /> <span className="hidden md:inline">Dark mode</span>
            </>
          ) }
        </div>
        { session && (
          <div className="flex items-center gap-2">
            <div className="hover:bg-black/10 p-2 rounded flex items-center gap-2">
              <UserCircleIcon className="h-6 w-6" />
              {session.user?.name}
            </div>
            <Link href="/admin">
              <Cog6ToothIcon className="h-10 w-10 flip hover:bg-black/10 p-2 rounded" />
            </Link>
            <ArrowRightOnRectangleIcon
              className="h-10 w-10 flip hover:bg-black/10 p-2 rounded cursor-pointer"
              onClick={() => signOut()}
            />
          </div>
        )}
        { !session && (
          <ArrowLeftOnRectangleIcon
            style={{ transform: 'scale(-1,1)' }}
            className="h-10 w-10 flip hover:bg-black/10 p-2 rounded"
            onClick={() => signIn('tkoaly')}
          />
        )}
      </div>
      <div className="mx-auto md:w-[80ch] flex items-center h-full gap-10">
        <div className="h-[12em] shrink-0 hidden md:block dark:[--logo-color:#ffd54f]">
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
          <div className="flex gap-5 mt-8">
            <Button secondary icon={<ChevronDoubleRightIcon className="h-5 w-5" />} onClick={() => push('https://tko-aly.fi/')}>Yhdistys</Button>
            <Button secondary icon={<ChevronDoubleRightIcon className="h-5 w-5" />} onClick={() => window.location.replace('https://tko-aly.fi/yrityksille')}>Yrityksille</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
