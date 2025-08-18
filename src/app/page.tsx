// import Image from "next/image";
import Footer from '@/components/footer';
import HorizontalScrollGallery from '@/components/horizontal-scroll-gallery';
import { Button } from 'flowbite-react';

export default function Home() {
  return (
    <div>
      <HorizontalScrollGallery/>
      <Footer/>
    </div>
  );
}
