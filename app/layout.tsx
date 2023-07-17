import { PrismaClient } from "@prisma/client";
import { Button } from "../components/Button";
import "../styles/globals.scss";
import { Logo } from "./logo";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Header from "./Header";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div>
          <Header />
          <div className="w-[80ch] mx-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
