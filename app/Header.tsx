'use client';

import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { Button } from "../components/Button";
import { Logo } from "./logo";

const Header = () => {
  const { push } = useRouter();

  return (
    <div className="bg-[#FFD54F] min-h-[20em] p-10">
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
            <Button secondary icon={<ChevronDoubleRightIcon className="h-5 w-5" />} onClick={() => push('/employers')}>Ilmoittajalle</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
