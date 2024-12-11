/* eslint-disable @next/next/no-img-element */

import { media } from '@wix/sdk';

type Props = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt' | 'srcSet' | 'width' | 'height'
> & {
  wixMediaIdentifier?: string;
  placeholder?: string;
  alt?: string | null;
} & (
    | { scaleToFill: true; targetWidth: number; targetHeight: number }
    | { scaleToFill?: false; targetWidth?: undefined; targetHeight?: undefined }
  );

export default function WixImage({
  wixMediaIdentifier,
  scaleToFill,
  targetWidth,
  targetHeight,
  placeholder = '/no_image_placeholder.png',
  alt,
  ...props
}: Props) {
  const imageUrl = wixMediaIdentifier
    ? scaleToFill
      ? media.getScaledToFillImageUrl(wixMediaIdentifier, targetWidth, targetHeight, {})
      : media.getImageUrl(wixMediaIdentifier).url
    : placeholder;
  return <img src={imageUrl} alt={alt ?? ''} {...props} />;
}
