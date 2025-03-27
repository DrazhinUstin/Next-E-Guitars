import ReviewsInfiniteList from '@/app/components/reviews/reviews-infinite-list';
import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import { getWixServerClient } from '@/app/lib/wix-client.server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Reviews',
};

export default async function Page() {
  const wixClient = await getWixServerClient();
  const loggedInMember = await fetchLoggedInMember(wixClient);

  if (!loggedInMember) notFound();

  return (
    <main>
      <ReviewsInfiniteList author={loggedInMember} />
    </main>
  );
}
