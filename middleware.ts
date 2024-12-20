import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient, OAuthStrategy, type Tokens } from '@wix/sdk';
import { env } from '@/env';
import { WIX_SESSION_COOKIE } from '@/app/lib/constants';

export const wixClient = createClient({
  auth: OAuthStrategy({ clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID }),
});

export async function middleware(request: NextRequest) {
  let tokens: Tokens = request.cookies.has(WIX_SESSION_COOKIE)
    ? JSON.parse(request.cookies.get(WIX_SESSION_COOKIE)?.value as string)
    : await wixClient.auth.generateVisitorTokens();

  if (tokens.accessToken.expiresAt < Math.floor(Date.now() / 1000)) {
    try {
      tokens = await wixClient.auth.renewToken(tokens.refreshToken);
    } catch (error) {
      tokens = await wixClient.auth.generateVisitorTokens();
    }
  }

  request.cookies.set(WIX_SESSION_COOKIE, JSON.stringify(tokens));

  const response = NextResponse.next({ request });
  response.cookies.set(WIX_SESSION_COOKIE, JSON.stringify(tokens), {
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
