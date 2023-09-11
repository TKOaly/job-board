import { DarkModeProvider } from "@/components/DarkModeProvider";
import "../styles/globals.scss";
import { InnerLayout } from "./InnerLayout";
import { NextAuthProviders } from "./NextAuthProviders";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DarkModeProvider>
      <NextAuthProviders>
        <InnerLayout>{children}</InnerLayout>
      </NextAuthProviders>
    </DarkModeProvider>
  )
}
