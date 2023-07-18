import "../styles/globals.scss";
import { NextAuthProviders } from "./NextAuthProviders";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div>
          <NextAuthProviders>
            {children}
          </NextAuthProviders>
        </div>
      </body>
    </html>
  )
}
