import { collections, products } from '@wix/stores';
import { currentCart, orders, backInStockNotifications } from '@wix/ecom';
import { redirects } from '@wix/redirects';
import { members } from '@wix/members';
import { reviews } from '@wix/reviews';
import { files } from '@wix/media';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { env } from '@/env';

export const client = createClient({
  modules: {
    collections,
    products,
    currentCart,
    orders,
    backInStockNotifications,
    redirects,
    members,
    reviews,
    files,
  },
  auth: OAuthStrategy({ clientId: env.NEXT_PUBLIC_WIX_CLIENT_ID }),
});
