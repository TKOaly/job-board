import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

export type Props = PropsWithChildren<{
  className?: string
}>;

const Card = ({ children, className }: Props) => {
  return (
    <div className={twMerge("rounded shadow", className)}>
      <div className="border-t border-x border-gray-200 rounded-t-md p-5">
        {children}
      </div>
      <div className="h-3 bg-[#FFD54F] rounded-b-md border-yellow-400 border-x border-b"></div>
    </div>
  );
}

export default Card;
