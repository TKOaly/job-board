import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware() {},
  {
    callbacks: {
      authorized: ({ token }) => token?.admin === true,
    },
    pages: {
      signIn: '/',
      signOut: '/',
    }
  }
)

export const config = {
  matcher: ['/admin/:rest*'],
}
