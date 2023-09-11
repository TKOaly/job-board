'use client';

import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { PropsWithChildren, useCallback, useState } from 'react';

interface AccordionProps {
  title: string;
  /**
   * Whether the accordion is collapsed on mount.
   * @default true
   */
  initialCollapsed?: boolean;
}

export const Accordion = ({
  title,
  children,
  initialCollapsed = true,
  ...rest
}: PropsWithChildren<AccordionProps>) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const toggle = useCallback(() => setCollapsed(c => !c), [setCollapsed]);

  return (
    <div>
      <div
        className="flex gap-2 items-center mt-10 mb-5 cursor-pointer"
        onClick={toggle}
      >
        <p className="text-xl font-bold select-none">{title}</p>
        {collapsed ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronDownIcon className="h-4 w-4" />
        )}
      </div>
      <div>{!collapsed && children}</div>
    </div>
  );
};
