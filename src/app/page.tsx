// import Image from "next/image";
import Footer from '@/components/footer';
import HorizontalScrollGallery from '@/components/horizontal-scroll-gallery';
import { Button } from 'flowbite-react';

export default function Home() {
  return (
    <div>
      <HorizontalScrollGallery/>
      <div className='home'>
        <div className='flex flex-row gap-3'>
          {/* style="border-radius:12px" */}
          {/* mobile issues */}
          <iframe data-testid="embed-iframe" src="https://open.spotify.com/embed/playlist/4BysGnIA94cTXlFrhoXGen?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          <iframe data-testid="embed-iframe" src="https://open.spotify.com/embed/playlist/4BysGnIA94cTXlFrhoXGen?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
          <iframe data-testid="embed-iframe" src="https://open.spotify.com/embed/track/0BZ7XAuCLJAghG4OAkhYjr?utm_source=generator" width="100%" height="352" frameBorder="0" allowFullScreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
        </div>
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
