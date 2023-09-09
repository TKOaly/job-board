'use client';

import { useDarkMode } from "@/components/DarkModeProvider";
import { PropsWithChildren } from "react";

export const InnerLayout: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  const [dark] = useDarkMode();

  return (
    <html lang="en" className={ dark ? 'dark' : 'light' }>
      <body className="dark:bg-[#171613] dark:text-[#e8e4da]">
        <div>
          {children}
        </div>
      </body>
    </html>
  );
};
