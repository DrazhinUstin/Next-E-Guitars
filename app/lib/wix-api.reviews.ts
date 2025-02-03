import type { WixClientType } from '@/app/lib/wix-client.base';
import { fetchLoggedInMember } from '@/app/lib/wix-api.members';

export interface CreateProductReviewValues {
  productId: string;
  content: {
    title?: string;
    body?: string;
    rating: number;
  };
}

export async function createProductReview(
  wixClient: WixClientType,
  { productId, content }: CreateProductReviewValues
) {
  try {
    const member = await fetchLoggedInMember(wixClient);

    if (!member) {
      throw Error('Unauthorized! Login to create a review!');
    }

    const authorName =
      member.contact?.firstName && member.contact.lastName
        ? `${member.contact.firstName} ${member.contact.lastName}`
        : member.contact?.firstName ||
          member.contact?.lastName ||
          member.profile?.nickname ||
          'Anonymous';

    const review = await wixClient.reviews.createReview({
      author: { authorName, contactId: member.contactId },
      content,
      entityId: productId,
      namespace: 'stores',
    });

    return review;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
