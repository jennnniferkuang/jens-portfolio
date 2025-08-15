'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useMediaQuery } from 'react-responsive';
import PictureFrame from './picture-frame';

export default function HorizontalScrollGallery() {

    const isMobile = useMediaQuery({ maxWidth: 767 });

    const sectionRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);

    gsap.registerPlugin(ScrollTrigger);

    useEffect(() => {
        if (!sectionRef.current || !triggerRef.current) return;

        let lastScrollY = window.scrollY;
        let isWalking = false;
        let frame = 1;
        let interval: NodeJS.Timeout;

        const sprite = document.getElementById('sprite') as HTMLImageElement;

        const updateFrame = () => {
        frame = frame >= 3 ? 1 : frame + 1;
        if (sprite) sprite.src = `/walk-${frame}.webp`;
        };

        const startWalking = () => {
        if (!isWalking) {
            isWalking = true;
            interval = setInterval(updateFrame, 120);
        }
        };

        const stopWalking = () => {
        isWalking = false;
        if (sprite) sprite.src = `/stationary.webp`;
        clearInterval(interval);
        };

        let scrollTimeout: NodeJS.Timeout | null = null;

        const handleScroll = () => {
            const delta = window.scrollY - lastScrollY;

            if (delta > 1) {
                // scrolling down → face right
                sprite.style.transform = 'scaleX(1)';
            } else if (delta < -1) {
                // scrolling up → face left
                sprite.style.transform = 'scaleX(-1)';
            }

            if (Math.abs(delta) > 2) {
                startWalking();
                if (scrollTimeout) clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(stopWalking, 200);
            }

            lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);

        const section = sectionRef.current;
        const trigger = triggerRef.current;
        const totalScroll = section.scrollWidth - window.innerWidth;
        console.log(section.scrollWidth)

        const pin = gsap.fromTo(sectionRef.current, {
            translateX: 0
        }, {
            translateX: -totalScroll,
            ease: 'none',
            duration: 1,
            scrollTrigger: {
                trigger: triggerRef.current,
                start: 'top top',
                end: `+=${totalScroll}`,
                scrub: 0.6,
                pin: true,
                pinSpacing: true
            }
        });

        return () => {
            pin.kill();
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
        }
    }, [])

    return (
        <section className='scroll-section-outer relative'>
            <div ref={triggerRef}>
                <img
                    src="/stationary.webp"
                    className="absolute left-30 -translate-x-1/2 z-5 w-60"
                    style={{ bottom: '20vh' }}
                    id="sprite"
                />
                <div className="floor z-1" style={{ width: 'totalScroll' }}></div>
                <div className='scroll-section-inner relative' ref={sectionRef}>
                    <div className='scroll-section'>
                        <div className="flex flex-col gap-3" style={{ top: '25vh' }}>
                            <p style={{ fontSize: '100px' }}>Hi! I’m Jen!</p>
                        </div>
                        {/* TODO: 
                            make frame + picture into a component
                            GET RID OF MAGIC NUMBERS (just a proof of concept rn)
                            mobile view PLEASE
                        */}
                        <PictureFrame
                            imgSrc='/me.png'/>
                        <PictureFrame
                            imgSrc='/test.png'
                            frame={2}
                            left={400}
                            top={50}
                            width={275}/>
                        <img
                            src="/frame2x3-white.webp"
                            className="absolute left-90 z-5 w-40"
                            style={{ bottom: '22vh' }}
                        />
                        <img
                            src="/frame1x1-white.webp"
                            className="absolute left-220 z-5 w-90"
                            style={{ bottom: '40vh' }}
                        />
                        <img
                            src="/frame1x1-white.webp"
                            className="absolute left-175 z-5 w-40"
                            style={{ bottom: '22vh' }}
                        />
                    </div>
                    <div className='scroll-section'>
                        <div className='flex md:flex-row flex-col gap-4'>
                            <div className='flex flex-col gap-3'>
                                <p style={{ fontSize: '30px', justifyItems: 'center', alignItems: 'center' }}>My favourite songs :P</p>
                                <iframe data-testid="embed-iframe" 
                                    src="https://open.spotify.com/embed/playlist/4BysGnIA94cTXlFrhoXGen?utm_source=generator" 
                                    height="352" 
                                    frameBorder="0" 
                                    allowFullScreen={true} 
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                    loading="lazy">
                                </iframe>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <p style={{ fontSize: '30px', justifyItems: 'center', alignItems: 'center' }}>My favourite songs :P</p>
                                <iframe data-testid="embed-iframe" 
                                    src="https://open.spotify.com/embed/playlist/4BysGnIA94cTXlFrhoXGen?utm_source=generator" 
                                    height="352" 
                                    frameBorder="0" 
                                    allowFullScreen={true} 
                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                    loading="lazy">
                                </iframe>
                            </div>
                        </div>
                    </div>
                    <div className='scroll-section'>

                    </div>
                    <div className='scroll-section'>
                        
                    </div>
                </div>
            </div>
        </section>
    );
}