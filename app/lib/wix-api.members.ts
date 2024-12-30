import type { WixClientType } from '@/app/lib/wix-client.base';
import { members } from '@wix/members';
import { cache } from 'react';

export const fetchLoggedInMember = cache(async (wixClient: WixClientType) => {
  try {
    const response = await wixClient.members.getCurrentMember({ fieldsets: [members.Set.FULL] });
    return response.member ?? null;
  } catch (error) {
    if ((error as any)?.details?.applicationError?.code === 'PERMISSION_DENIED') {
      return null;
    }
    console.error(error);
    throw Error('Error: Failed to get a current member');
  }
});
