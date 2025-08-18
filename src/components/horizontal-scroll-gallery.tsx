'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { useMediaQuery } from 'react-responsive';
import PictureFrame from './picture-frame';
import { Button } from 'flowbite-react';
import { SECTION_COUNT } from '@/config';

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
            frame = frame >= 3 ? 1 : frame + 1; // 3 sprite frames
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

        const pin = gsap.fromTo(sectionRef.current, {
            translateX: 0
        }, {
            translateX: -totalScroll,
            ease: 'none',
            duration: 1,
            scrollTrigger: {
                trigger: trigger,
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
                    className="absolute left-15 sm:left-30 -translate-x-1/2 z-5 w-30 sm:w-60"
                    style={{ bottom: '20vh' }}
                    id="sprite"
                />
                <div className="floor z-1" style={{ width: 'totalScroll' }}></div>
                <div className='scroll-section-inner relative' ref={sectionRef} style={{ width: `${SECTION_COUNT * 100 }vw`}}>
                    <div className='scroll-section'>
                        <div className="flex flex-col gap-3">
                            <p style={{ fontSize: '100px', textAlign: 'center' }}>Hi! I’m Jen!</p>
                        </div>
                        <PictureFrame
                            imgSrc='/me.png'
                            frame={1}
                            xPos={15}
                            yPos={20}
                            width={15}/>
                        <PictureFrame
                            imgSrc='/dog.jpg'
                            frame={2}
                            xPos={45}
                            yPos={25}
                            width={25}/>
                        <PictureFrame
                            imgSrc='/concert.jpg'
                            frame={3}
                            xPos={82}
                            yPos={25}
                            width={20}/>
                        <PictureFrame
                            imgSrc='/burlington.jpg'
                            frame={1}
                            xPos={70}
                            yPos={65}
                            width={15}/>
                        <PictureFrame
                            imgSrc='/comp-sci-museum.jpg'
                            frame={1}
                            xPos={20}
                            yPos={55}
                            width={20}/>
                    </div>
                    <div className='scroll-section'>
                        <div className='flex md:flex-row flex-col gap-4'>
                            <div className='flex flex-col sm:flex-row gap-3'>
                                <div className='flex flex-col gap-3'>
                                    <p style={{ textAlign: 'center', fontSize: '30px' }}>My favourite songs :P</p>
                                    <iframe data-testid="embed-iframe" 
                                        src="https://open.spotify.com/embed/playlist/4BysGnIA94cTXlFrhoXGen?utm_source=generator" 
                                        height="200 sm:352" 
                                        frameBorder="0" 
                                        allowFullScreen={true} 
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                        loading="lazy">
                                    </iframe>
                                </div>
                                <div className='flex flex-col gap-3'>
                                    <p style={{ textAlign: 'center', fontSize: '30px' }}>Losercore Computer Playlist</p>
                                    <iframe data-testid="embed-iframe" 
                                        src="https://open.spotify.com/embed/playlist/7JNWAdUP3DNIM3vpctdw93?utm_source=generator" 
                                        width="100%" 
                                        height="200 sm:352" 
                                        frameBorder="0" 
                                        allowFullScreen={true} 
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                                        loading="lazy">
                                    </iframe>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='scroll-section'>
                        <div className='flex flex-col gap-3 p-6' style={{ justifyItems: 'center', alignItems: 'center' }}>
                            <p style={{ textAlign: 'center', fontSize: '50px' }}>Fun Fact!</p>
                            <p style={{ textAlign: 'center', fontSize: '25px' }}>This site is a tribute to my first EVER game called Out of Sight, a 2D horror platformer which is a totally dookie piece of code, but it still means a lot to me to this day! You can check it out here:</p>
                            <div className='flex flex-row gap-4'>
                            <Button as="a" color='dark' href="https://youtu.be/wUkGteWnN54" target="_blank">Demo</Button>
                            <Button as="a" color='dark' href="https://github.com/jennnniferkuang/Out-of-Sight" target="_blank">Repo</Button>
                            </div>
                        </div>
                    </div>
                    <div className='scroll-section'>
                        <div className='flex flex-col gap-3 p-6' style={{ justifyItems: 'center', alignItems: 'center' }}>
                            <p style={{ textAlign: 'center', fontSize: '30px' }}>This site is still under construction!</p>
                            <p style={{ textAlign: 'center', fontSize: '25px' }}>More exciting things to come, but for now, learn more about me by checking out my:</p>
                            <div className='flex flex-row gap-4'>
                            <Button as="a" color='dark' href="https://github.com/jennnniferkuang" target="_blank">GitHub</Button>
                            <Button as="a" color='dark' href="https://devpost.com/jennnniferkuang?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav&_gl=1*1qqzdkq*_gcl_au*Mjc1NTk4NDEuMTc0ODQzNjExMw..*_ga*MTg2NjAyNTM0OC4xNzQ4NDM2MTEz*_ga_0YHJK3Y10M*czE3NTU1Mzc4MDIkbzEyJGcxJHQxNzU1NTM3ODA3JGo1NSRsMCRoMA" target="_blank">Devpost</Button>
                            <Button as="a" color='dark' href="https://drive.google.com/file/d/1XUg5-LMHmn9yxra0V4K48jUq0PasT_Gj/view?usp=drive_link" target="_blank">Resume!</Button>
                            </div>
                            <p style={{ textAlign: 'center', fontSize: '30px' }}>Other fun places to get to know me:</p>
                            <div className='flex flex-row gap-4'>
                            <Button as="a" color='dark' href="https://steamcommunity.com/id/cornflaekes/" target="_blank">Steam</Button>
                            <Button as="a" color='dark' href="https://open.spotify.com/user/31vscmisfq4qozqjnpr35sdab4qe?si=c3ff83da36ec4390" target="_blank">Spotify</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}