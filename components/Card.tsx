import { PropsWithChildren } from 'react';
import { twMerge } from 'tailwind-merge';

export type Props = PropsWithChildren<{
  className?: string;
}>;

export const CardField = ({ label, children }) => (
  <div className="my-3">
    <span className="text-xs text-gray-600 dark:text-[#938e86] uppercase font-bold">
      {label}
    </span>
    <div className="flex items-center gap-2">{children}</div>
  </div>
);

const Card = ({ children, className }: Props) => {
  return (
    <div className={twMerge('rounded shadow', className)}>
      <div className="border-t border-x dark:bg-[#25231F] border-gray-200 dark:border-[#35322b] rounded-t-md p-5">
        {children}
      </div>
      <div className="h-3 bg-[#FFD54F] dark:bg-[#b7962e] dark:border-[#b7962e] rounded-b-md border-yellow-400 border-x border-b"></div>
    </div>
  );
};

export default Card;
