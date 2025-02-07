import type { WixClientType } from '@/app/lib/wix-client.base';
import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import type { reviews } from '@wix/reviews';

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

export interface FetchProductReviewsOptions {
  productId: string;
  cursor?: reviews.Cursors['next'];
  limit?: number;
}

export async function fetchProductReviews(
  wixClient: WixClientType,
  { productId, cursor, limit = 2 }: FetchProductReviewsOptions
) {
  try {
    let query = wixClient.reviews.queryReviews().eq('entityId', productId).limit(limit);

    if (cursor) {
      query = query.skipTo(cursor);
    }

    const response = await query.find();
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
