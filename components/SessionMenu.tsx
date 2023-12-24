import { autoUpdate, useClick, useDismiss, useFloating, useInteractions } from "@floating-ui/react";
import { ArrowRightOnRectangleIcon, Cog6ToothIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { Session } from "next-auth";
import { signIn, signOut } from 'next-auth/react';
import { useState } from "react";
import { useTranslation, Link } from "@/app/i18n/client";

export type Props = {
  session: Session | null
}

export const SessionMenu = ({ session }: Props) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { refs, context, floatingStyles } = useFloating({
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    strategy: 'absolute',
    middleware: [],
    placement: 'bottom-end',
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([
    useDismiss(context),
    useClick(context),
  ]);

  if (!session) {
    return (
      <ArrowLeftOnRectangleIcon
        style={{ transform: 'scale(-1,1)' }}
        className="h-10 w-10 flip hover:bg-black/10 p-2 rounded cursor-pointer"
        onClick={() => signIn('tkoaly')}
      />
    );
  }

  return (
    <>
      <div className="contents md:hidden">
        <div className="hover:bg-black/10 p-2 rounded flex items-center gap-2 whitespace-nowrap cursor-pointer" ref={refs.setReference} {...getReferenceProps()}>
          <UserCircleIcon className="h-6 w-6" />
        </div>
        { open && (
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className="z-10 p-2 dark:bg-[#171613] shadow-xl border dark:bg-[#25231F] dark:border-[#35322b] bg-white rounded-md"
            {...getFloatingProps()}
          >
            <div className="p-2 rounded flex items-center gap-2 whitespace-nowrap">
              <UserCircleIcon className="h-6 w-6" />
              {session.user?.name}
            </div>
            <Link href="/admin" className="hover:bg-black/10 p-2 rounded flex items-center gap-2 whitespace-nowrap">
              <Cog6ToothIcon className="h-6 w-6 flip" />
              {t('menu.administration')}
            </Link>
            <div
              className="hover:bg-black/10 cursor-pointer p-2 rounded flex items-center gap-2 whitespace-nowrap"
              onClick={() => signOut()}
            >
              <ArrowRightOnRectangleIcon className="h-6 w-6 flip" />
              {t('menu.logOut')}
            </div>
          </div>
        )}
      </div>
      <div className="hidden md:contents">
        <div className="hover:bg-black/10 p-2 rounded flex items-center gap-2 whitespace-nowrap">
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
    </>
  );
}
