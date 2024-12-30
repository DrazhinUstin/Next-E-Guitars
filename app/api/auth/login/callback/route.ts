import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { LOGIN_REQUEST_DATA_COOKIE, WIX_SESSION_COOKIE } from '@/app/lib/constants';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import { type OauthData } from '@wix/sdk';

export async function GET(request: NextRequest) {
  const loginRequestData: OauthData | null = request.cookies.has(LOGIN_REQUEST_DATA_COOKIE)
    ? JSON.parse(request.cookies.get(LOGIN_REQUEST_DATA_COOKIE)?.value as string)
    : null;

  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const error = request.nextUrl.searchParams.get('error');
  const error_description = request.nextUrl.searchParams.get('error_description');

  if (error) {
    return new Response(error_description, { status: 400 });
  }

  if (!code || !state || !loginRequestData) {
    return new Response('Invalid request!', { status: 400 });
  }

  const wixClient = await getWixServerClient();
  const memberTokens = await wixClient.auth.getMemberTokens(code, state, loginRequestData);

  const response = NextResponse.redirect(loginRequestData.originalUri || new URL('/', request.url));
  response.cookies.delete(LOGIN_REQUEST_DATA_COOKIE);
  response.cookies.set(WIX_SESSION_COOKIE, JSON.stringify(memberTokens), {
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
