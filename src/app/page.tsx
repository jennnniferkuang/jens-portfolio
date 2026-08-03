import HorizontalScrollGallery from '@/components/horizontal-scroll-gallery';
import { TOTAL_GALLERY_PICTURES } from '@/lib/gallery-config';
import { getGalleryImageSources } from '@/lib/gallery';

export const dynamic = "force-dynamic";

export default async function Home() {
  const galleryImageSources = await getGalleryImageSources(
    TOTAL_GALLERY_PICTURES,
  );

  return (
    <div>
      <HorizontalScrollGallery galleryImageSources={galleryImageSources} />
    </div>
  );
}
