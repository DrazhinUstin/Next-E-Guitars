import type { Metadata } from 'next';
import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import { notFound } from 'next/navigation';
import UpdateMemberForm from './update-member-form';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function Page() {
  const wixClient = await getWixServerClient();
  const loggedInMember = await fetchLoggedInMember(wixClient);

  if (!loggedInMember) notFound();

  return (
    <main className="space-y-8">
      <h2 className="text-center text-2xl font-semibold">Your profile</h2>
      <UpdateMemberForm member={loggedInMember} />
    </main>
  );
}
