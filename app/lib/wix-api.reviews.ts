import type { WixClientType } from '@/app/lib/wix-client.base';
import { fetchLoggedInMember } from '@/app/lib/wix-api.members';
import type { reviews } from '@wix/reviews';
import type { members } from '@wix/members';
import { products } from '@wix/stores';

export interface CreateReviewValues {
  productId: string;
  content: {
    title?: string;
    body?: string;
    rating: number;
  };
}

export async function createReview(
  wixClient: WixClientType,
  { productId, content }: CreateReviewValues
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

export interface FetchReviewsOptions {
  filters?: {
    productId?: products.Product['_id'];
    contactId?: members.Member['contactId'];
  };
  sort?: keyof typeof sortValues;
  cursor?: reviews.Cursors['next'];
  limit?: number;
}

export async function fetchReviews(
  wixClient: WixClientType,
  { filters = {}, sort = 'created_desc', cursor, limit = 2 }: FetchReviewsOptions
) {
  try {
    let query = wixClient.reviews.queryReviews().limit(limit);

    const { productId, contactId } = filters;
    if (productId) {
      query = query.eq('entityId', productId);
    }
    if (contactId) {
      query = query.eq('author.contactId', contactId);
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

export async function fetchReviewsCount(
  wixClient: WixClientType,
  filters?: Omit<Exclude<FetchReviewsOptions['filters'], undefined>, 'contactId'>
) {
  try {
    const response = await wixClient.reviews.countReviews({
      filter: filters && {
        ...(filters.productId && { entityId: filters.productId }),
      },
    });
    return response.count;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteReview(wixClient: WixClientType, review: reviews.Review) {
  const loggedInMember = await fetchLoggedInMember(wixClient);

  if (!loggedInMember) {
    throw Error('Unauthorized!');
  }

  if (loggedInMember.contactId !== review.author?.contactId) {
    throw Error('Unauthorized! Only author of the review can delete it.');
  }

  try {
    const response = await wixClient.reviews.deleteReview(review._id as string);
    return response.review;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
