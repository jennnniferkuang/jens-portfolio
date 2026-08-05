import PortfolioScrollExperience from '@/components/portfolio-scroll-experience';
import { TOTAL_GALLERY_PICTURES } from '@/lib/gallery-config';
import { getGalleryImages } from '@/lib/gallery';

export const dynamic = "force-dynamic";

export default async function Home() {
  const galleryImages = await getGalleryImages(
    TOTAL_GALLERY_PICTURES,
  );

  return (
    <PortfolioScrollExperience galleryImages={galleryImages} />
  );
}
