import { getServerSession } from "next-auth/next";
import Header from "@/app/Header";
import { config } from '@/next-auth';

export default async function PublicLayout({ children }) {
  const session = await getServerSession(config);

  return (
    <>
      <Header session={session} />
      <div className="w-[80ch] mx-auto">
        {children}
      </div>
    </>
  );
}
