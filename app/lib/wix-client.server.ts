import { cache } from 'react';
import { cookies } from 'next/headers';
import { WIX_SESSION_COOKIE } from './constants';
import { getWixClient } from './wix-client.base';

export const getWixServerClient = cache(async () => {
  const cookieStore = await cookies();
  const tokens = cookieStore.has(WIX_SESSION_COOKIE)
    ? JSON.parse(cookieStore.get(WIX_SESSION_COOKIE)?.value as string)
    : undefined;
  return getWixClient(tokens);
});
