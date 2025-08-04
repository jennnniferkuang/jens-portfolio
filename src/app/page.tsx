// import Image from "next/image";
import Footer from '@/components/footer';
import HorizontalScrollGallery from '@/components/horizontal-scroll-gallery';
import { Button } from 'flowbite-react';

export default function Home() {
  return (
    <div>
      <HorizontalScrollGallery/>
      <div className='home'>
        <h3>Fun Fact!</h3>
        <p className='justify-center'>This site is a tribute to my first EVER game called Out of Sight, a 2D horror platformer. Totally atrocious piece of code, but it still means a lot to me to this day! You can check it out here:</p>
        <div className='flex flex-row gap-4'>
          <Button>Demo</Button>
          <Button>Repo</Button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
