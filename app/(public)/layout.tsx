import { getServerSession } from "next-auth/next";
import Header from "@/app/Header";
import { config } from '@/next-auth';
import { DarkModeWrapper, useDarkMode } from "@/components/DarkModeProvider";

export default async function PublicLayout({ children }) {
  const session = await getServerSession(config);

  return (
    <DarkModeWrapper>
      <div className="dark:bg-[#171613] dark:text-[#e8e4da] min-h-100vh mb-[-1px] pb-[1px] w-full h-full">
        <Header session={session} />
        <div className="md:w-[80ch] mx-auto">
          {children}
        </div>
      </div>
    </DarkModeWrapper>
  );
}
