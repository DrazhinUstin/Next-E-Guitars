import { collections, products } from '@wix/stores';
import { currentCart, checkout, orders, backInStockNotifications } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { members } from '@wix/members';
import { reviews } from '@wix/reviews';
import { files } from '@wix/media';
import { createClient, OAuthStrategy, type Tokens } from '@wix/sdk';
import { env } from '@/env';

export function getWixClient(tokens: Tokens | undefined) {
  return createClient({
    modules: {
      collections,
      products,
      currentCart,
      checkout,
      orders,
      backInStockNotifications,
      redirects,
      members,
      reviews,
      files,
    },
    auth: OAuthStrategy({ clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID, tokens }),
  });
}

export type WixClientType = ReturnType<typeof getWixClient>;
