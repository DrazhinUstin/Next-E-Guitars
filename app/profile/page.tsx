import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import { notFound } from 'next/navigation';
import UpdateMemberForm from './update-member-form';

export default async function Page() {
  const wixClient = await getWixServerClient();
  const loggedInMember = await fetchLoggedInMember(wixClient);

  if (!loggedInMember) notFound();

  return (
    <main>
      <UpdateMemberForm
        key={(loggedInMember.contact?.firstName ?? '') + (loggedInMember.contact?.lastName ?? '')}
        member={loggedInMember}
      />
    </main>
  );
}
