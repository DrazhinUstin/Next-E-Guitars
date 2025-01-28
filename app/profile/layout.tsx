import type { Metadata } from 'next';
import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import { notFound } from 'next/navigation';
import NavLinks from './nav-links';

export const metadata: Metadata = {
  title: {
    template: 'Profile - %s',
    default: 'Profile',
  },
};

export default async function Layout({ children }: { children: React.ReactNode }) {
  const wixClient = await getWixServerClient();
  const loggedInMember = await fetchLoggedInMember(wixClient);

  if (!loggedInMember) notFound();

  return (
    <div className="space-y-8">
      <h1 className="text-center text-2xl font-semibold">Profile</h1>
      <NavLinks />
      {children}
    </div>
  );
}
