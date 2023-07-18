import { PropsWithChildren } from "react";

export type Props = PropsWithChildren<{}>;

const Card = ({ children }: Props) => {
  return (
    <div className="rounded shadow">
      <div className="mt-10 border-t border-x border-gray-200 rounded-t-md p-5">
        {children}
      </div>
      <div className="h-3 bg-[#FFD54F] rounded-b-md border-yellow-400 border-x border-b"></div>
    </div>
  );
}

export default Card;
