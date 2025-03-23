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

export const sortValues = {
  created_desc: 'Creation date (descending)',
  created_asc: 'Creation date (ascending)',
  rating_desc: 'Rating (descending)',
  rating_asc: 'Rating (ascending)',
} as const;

export interface FetchProductReviewsOptions {
  filters?: {
    productId?: string;
  };
  sort?: keyof typeof sortValues;
  cursor?: reviews.Cursors['next'];
  limit?: number;
}

export async function fetchProductReviews(
  wixClient: WixClientType,
  { filters = {}, sort = 'created_desc', cursor, limit = 2 }: FetchProductReviewsOptions
) {
  try {
    let query = wixClient.reviews.queryReviews().limit(limit);

    const { productId } = filters;
    if (productId) {
      query = query.eq('entityId', productId);
    }

    switch (sort) {
      case 'created_asc':
        query = query.ascending('_createdDate');
        break;
      case 'created_desc':
        query = query.descending('_createdDate');
        break;
      case 'rating_asc':
        query = query.ascending('content.rating');
        break;
      case 'rating_desc':
        query = query.descending('content.rating');
        break;
    }

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

export async function countProductReviews(wixClient: WixClientType, productId: string) {
  try {
    const response = await wixClient.reviews.countReviews({ filter: { entityId: productId } });
    return response.count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
