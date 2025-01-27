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

export interface updateLoggedInMemberValues {
  firstName: string;
  lastName: string;
}

export async function updateLoggedInMember(
  wixClient: WixClientType,
  { firstName, lastName }: updateLoggedInMemberValues
) {
  try {
    const loggedInMember = await fetchLoggedInMember(wixClient);

    if (!loggedInMember?._id) {
      throw Error(`Logged in member _id is ${loggedInMember?._id}`);
    }

    const response = await wixClient.members.updateMember(loggedInMember._id, {
      contact: { firstName, lastName },
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
