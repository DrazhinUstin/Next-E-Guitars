import { products } from '@wix/stores';
import Image from 'next/image';
import noImage from '@/public/no_image_placeholder.png';
import WixImage from '@/app/components/wix-image';
import { PlayIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/app/lib/utils';
import Zoom from 'react-medium-image-zoom';

export default function ProductMedia({ mediaItems }: { mediaItems: products.MediaItem[] }) {
  const [selectedMedia, setSelectedMedia] = useState<products.MediaItem>(mediaItems[0]);

  if (!mediaItems.length) {
    return (
      <div className="md:sticky md:top-0">
        <Image src={noImage} alt="No image placeholder" priority />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:sticky md:top-0">
      {selectedMedia.mediaType === products.MediaItemType.image ? (
        <Zoom key={selectedMedia._id}>
          <WixImage
            wixMediaIdentifier={selectedMedia.image?.url}
            targetWidth={1000}
            targetHeight={1000}
            scaleToFill
            alt={selectedMedia.image?.altText}
          />
        </Zoom>
      ) : (
        <video
          src={selectedMedia.video?.files?.[0].url}
          width={selectedMedia.video?.files?.[0].width}
          height={selectedMedia.video?.files?.[0].height}
          controls
        />
      )}
      <div className="flex flex-wrap gap-2">
        {mediaItems.map((item) => (
          <div
            key={item._id}
            className={cn(
              'relative max-w-24 cursor-pointer overflow-hidden rounded-sm border',
              selectedMedia._id === item._id && 'border-primary'
            )}
            onClick={() => setSelectedMedia(item)}
          >
            {item.mediaType === products.MediaItemType.image ? (
              <WixImage
                wixMediaIdentifier={item.image?.url}
                scaleToFill
                targetWidth={100}
                targetHeight={100}
                alt={item.image?.altText}
              />
            ) : (
              <>
                <WixImage
                  wixMediaIdentifier={
                    item.thumbnail?.url?.split(item.video?.stillFrameMediaId ?? '')[0] +
                    (item.video?.stillFrameMediaId ?? '')
                  }
                  scaleToFill
                  targetWidth={100}
                  targetHeight={100}
                  alt={item.thumbnail?.altText}
                />
                <span className="absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 transform place-items-center rounded-full bg-black/50 text-white">
                  <PlayIcon />
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
