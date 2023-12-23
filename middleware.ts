import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLang, languages, cookieName } from '@/app/i18n/settings'

acceptLanguage.languages(languages)

export function middleware(req: NextRequest) {
  let lang: string | null = null

  const cookie = req.cookies.get(cookieName)
  const header = req.headers.get('Accept-Language')

  if (cookie !== undefined) {
    lang = acceptLanguage.get(cookie.value);
  }

  if (lang === null && header !== null) {
    lang = acceptLanguage.get(header)
  }

  if (lang === null) {
    lang = fallbackLang;
  }

  // Redirect if lng in path is not supported
  if (
    !languages.some(loc => req.nextUrl.pathname.startsWith(`/${loc}`)) &&
    !req.nextUrl.pathname.startsWith('/_next')
  ) {
    return NextResponse.redirect(new URL(`/${lang}${req.nextUrl.pathname}`, req.url))
  }

  const referer = req.headers.get('referer')

  if (referer) {
    const refererUrl = new URL(referer)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set(cookieName, lngInReferer)
    return response
  }

  return NextResponse.next()
};

export const config = {
  matcher: [
    '/admin/:rest*',
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)',
  ]
}

const authSettings = {
  callbacks: {
    authorized: ({ token }) => token?.admin === true,
  },
  pages: {
    signIn: '/',
    signOut: '/',
  },
};

export default withAuth(middleware, authSettings);
