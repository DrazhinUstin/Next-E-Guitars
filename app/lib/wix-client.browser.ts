import { cache } from 'react';
import Cookies from 'js-cookie';
import { getWixClient } from './wix-client.base';
import { WIX_SESSION_COOKIE } from './constants';

export const getWixBrowserClient = cache(() => {
  const tokens = Cookies.get(WIX_SESSION_COOKIE)
    ? JSON.parse(Cookies.get(WIX_SESSION_COOKIE) as string)
    : undefined;
  return getWixClient(tokens);
});
