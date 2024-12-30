'use client';

import { usePathname } from 'next/navigation';
import { useToast } from '@/app/hooks/use-toast';
import { getLoginRequestData, getLoginUrl, getLogoutUrl } from '@/app/lib/wix-api.auth';
import Cookies from 'js-cookie';
import { LOGIN_REQUEST_DATA_COOKIE, WIX_SESSION_COOKIE } from '@/app/lib/constants';
import { getWixBrowserClient } from '@/app/lib/wix-client.browser';

export const useAuth = () => {
  const pathname = usePathname();
  const { toast } = useToast();

  async function login() {
    try {
      const loginRequestData = getLoginRequestData(getWixBrowserClient(), pathname);

      Cookies.set(LOGIN_REQUEST_DATA_COOKIE, JSON.stringify(loginRequestData), {
        expires: new Date(Date.now() + 10 * 60 * 1000),
      });

      const loginUrl = await getLoginUrl(getWixBrowserClient(), loginRequestData);
      window.location.href = loginUrl;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error!', description: (error as Error).message });
    }
  }

  async function logout() {
    try {
      const logoutUrl = await getLogoutUrl(getWixBrowserClient(), pathname);
      Cookies.remove(WIX_SESSION_COOKIE);
      window.location.href = logoutUrl;
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error!', description: (error as Error).message });
    }
  }

  return { login, logout };
};
