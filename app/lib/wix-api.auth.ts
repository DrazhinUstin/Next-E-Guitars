import type { WixClientType } from '@/app/lib/wix-client.base';
import { env } from '@/env';
import type { OauthData } from '@wix/sdk';

export function getLoginRequestData(wixClient: WixClientType, originalPathname?: string) {
  try {
    const loginRequestData = wixClient.auth.generateOAuthData(
      `${env.NEXT_PUBLIC_APP_BASE_URL}/api/auth/login/callback`,
      env.NEXT_PUBLIC_APP_BASE_URL + (originalPathname ?? '')
    );
    return loginRequestData;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLoginUrl(wixClient: WixClientType, loginRequestData: OauthData) {
  try {
    const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData, {
      responseMode: 'query',
    });
    return authUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getLogoutUrl(wixClient: WixClientType, originalPathname?: string) {
  try {
    const { logoutUrl } = await wixClient.auth.logout(
      env.NEXT_PUBLIC_APP_BASE_URL + (originalPathname ?? '')
    );
    return logoutUrl;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
