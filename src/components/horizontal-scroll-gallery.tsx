'use client';

import { useRef, useEffect, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { Button } from 'flowbite-react';
import { SECTION_COUNT } from '@/config';
import Image from 'next/image';
import GalleryFrames from '@/components/gallery-frames';
import { GALLERY_ROOM_SETTINGS } from '@/lib/gallery-config';
import type { GalleryImage, GalleryRoomConfig } from '@/lib/gallery-placement';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

gsap.registerPlugin(ScrollTrigger);

type HorizontalScrollGalleryProps = {
    galleryImages: GalleryImage[];
};

const RENDER_GALLERY_FRAMES = false;

function distributeImagesAcrossRooms(
    galleryImages: GalleryImage[],
): GalleryRoomConfig[] {
    const rooms = GALLERY_ROOM_SETTINGS.map((room) => ({
        ...room,
        images: [],
    })) as GalleryRoomConfig[];
    let sourceIndex = 0;

    for (const room of rooms) {
        if (sourceIndex >= galleryImages.length) {
            break;
        }

        const roomEnd = Math.min(
            sourceIndex + room.count,
            galleryImages.length,
        );
        room.images.push(...galleryImages.slice(sourceIndex, roomEnd));
        sourceIndex = roomEnd;
    }

    return rooms;
}

export default function HorizontalScrollGallery({
    galleryImages,
}: HorizontalScrollGalleryProps) {
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const triggerRef = useRef<HTMLDivElement | null>(null);
    const spriteRef = useRef<HTMLImageElement | null>(null);
    const galleryRooms = useMemo(
        () => distributeImagesAcrossRooms(galleryImages),
        [galleryImages],
    );

    useEffect(() => {
        if (!sectionRef.current || !triggerRef.current) return;

        let lastScrollY = window.scrollY;
        let isWalking = false;
        let frame = 1;
        let interval: ReturnType<typeof setInterval> | undefined;

        const sprite = spriteRef.current;
        if (!sprite) return;

        ['/stationary.webp', '/walk-1.webp', '/walk-2.webp', '/walk-3.webp'].forEach((src) => {
            const image = new window.Image();
            image.src = src;
        });

        const updateFrame = () => {
            frame = frame >= 3 ? 1 : frame + 1; // 3 sprite frames
            sprite.src = `/walk-${frame}.webp`;
        };

        const startWalking = () => {
            if (!isWalking) {
                isWalking = true;
                updateFrame();
                interval = setInterval(updateFrame, 120);
            }
        };

        const stopWalking = () => {
            isWalking = false;
            sprite.src = `/stationary.webp`;
            clearInterval(interval);
        };

        let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

        const handleScroll = () => {
            const delta = window.scrollY - lastScrollY;
            const sprite = spriteRef.current;

            if (sprite && delta > 1) {
                // scrolling down → face right
                sprite.style.transform = 'scaleX(1)';
            } else if (sprite && delta < -1) {
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
        const getTotalScroll = () =>
            Math.max(0, section.scrollWidth - document.documentElement.clientWidth);

        const ctx = gsap.fromTo(section, {
            x: 0
        }, {
            x: () => -getTotalScroll(),
            ease: 'none',
            duration: 1,
            scrollTrigger: {
                trigger: trigger,
                start: 'top top',
                end: () => `+=${getTotalScroll()}`,
                scrub: 0.6,
                pin: true,
                pinSpacing: true,
                invalidateOnRefresh: true,
            }
        });

        return () => {
            ctx.revert();
            window.removeEventListener('scroll', handleScroll);
            clearInterval(interval);
            if (scrollTimeout) clearTimeout(scrollTimeout);
        }
    }, [])

    return (
        <section className='scroll-section-outer relative'>
            <div ref={triggerRef} className="relative">
                <div className="floor z-1">
                    <Image
                        src="/stationary.webp"
                        className="walker absolute left-15 sm:left-30 -translate-x-1/2 z-5 w-30 sm:w-60"
                        ref={spriteRef}
                        alt=""
                        width={100}
                        height={100}
                        loading="eager"
                        unoptimized
                    />
                </div>
                <div className='scroll-section-inner relative' ref={sectionRef} style={{ width: `${SECTION_COUNT * 100 }vw`}}>
                    <div className='scroll-section'>
                        <div className="gallery-canvas">
                            {RENDER_GALLERY_FRAMES ? <GalleryFrames config={galleryRooms[0]} /> : null}
                            <div className="gallery-room-content flex flex-col gap-2" data-gallery-obstacle>
                                <p style={{ fontSize: 'calc(100px * var(--font-scale, 1))', textAlign: 'center' }}>Hi! I’m Jen!</p>
                                <p style={{ textAlign: 'center', fontSize: 'calc(20px * var(--font-scale, 1))' }}>scroll down to explore the exhibit</p>
                            </div>
                        </div>
                    </div>
                    <div className='scroll-section'>
                        <div className="gallery-canvas">
                            {RENDER_GALLERY_FRAMES ? <GalleryFrames config={galleryRooms[1]} /> : null}
                            <div className='gallery-room-content flex flex-col gap-3 p-6' data-gallery-obstacle style={{ justifyItems: 'center' }}>
                                <p style={{ textAlign: 'start', fontSize: 'calc(25px * var(--font-scale, 1))' }}>About Me:</p>
                                <ul>
                                    <li style={{ textAlign: 'start', fontSize: 'calc(20px * var(--font-scale, 1))' }}>
                                        I’m a 2nd year software engineering student at the University of Waterloo
                                    </li>
                                    <li style={{ textAlign: 'start', fontSize: 'calc(20px * var(--font-scale, 1))' }}>
                                        I’m currently on a gap year working as a founding engineer at a startup called Otto-SR
                                    </li>
                                    <li style={{ textAlign: 'start', fontSize: 'calc(20px * var(--font-scale, 1))' }}>
                                        I luv making/playing video games
                                    </li>
                                    <li style={{ textAlign: 'start', fontSize: 'calc(20px * var(--font-scale, 1))' }}>
                                        I luv skiing and biking and adventuring
                                    </li>
                                    <li style={{ textAlign: 'start', fontSize: 'calc(20px * var(--font-scale, 1))' }}>
                                        I do art and I love crafting (making a sister art site soon!)
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='scroll-section'>
                        <div className="gallery-canvas">
                            {RENDER_GALLERY_FRAMES ? <GalleryFrames config={galleryRooms[2]} /> : null}
                            <div className='gallery-room-content flex flex-col gap-4 md:flex-row' data-gallery-obstacle>
                                <div className='flex flex-col sm:flex-row gap-3'>
                                    <div className='flex flex-col gap-3'>
                                        <p style={{ textAlign: 'center', fontSize: 'calc(30px * var(--font-scale, 1))' }}>My favourite songs :P</p>
                                        <iframe data-testid="embed-iframe"
                                            className="spotify-embed"
                                            src="https://open.spotify.com/embed/playlist/4BysGnIA94cTXlFrhoXGen?utm_source=generator"
                                            frameBorder="0"
                                            allowFullScreen={true}
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy">
                                        </iframe>
                                    </div>
                                    <div className='flex flex-col gap-3'>
                                        <p style={{ textAlign: 'center', fontSize: 'calc(30px * var(--font-scale, 1))' }}>Losercore Computer Playlist</p>
                                        <iframe data-testid="embed-iframe"
                                            className="spotify-embed"
                                            src="https://open.spotify.com/embed/playlist/7JNWAdUP3DNIM3vpctdw93?utm_source=generator"
                                            frameBorder="0"
                                            allowFullScreen={true}
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy">
                                        </iframe>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='scroll-section'>
                        <div className="gallery-canvas">
                            {RENDER_GALLERY_FRAMES ? <GalleryFrames config={galleryRooms[3]} /> : null}
                            <div className='gallery-room-content flex flex-col gap-3 p-6' data-gallery-obstacle style={{ justifyItems: 'center', alignItems: 'center' }}>
                                <p style={{ textAlign: 'center', fontSize: 'calc(50px * var(--font-scale, 1))' }}>Fun Fact!</p>
                                <p style={{ textAlign: 'center', fontSize: 'calc(25px * var(--font-scale, 1))' }}>This site is a tribute to my first EVER game called Out of Sight, a 2D horror platformer which is a totally dookie piece of code, but it still means a lot to me to this day! You can check it out here:</p>
                                <div className='flex flex-row gap-4'>
                                <Button as="a" color='dark' href="https://youtu.be/wUkGteWnN54" target="_blank">Demo</Button>
                                <Button as="a" color='dark' href="https://github.com/jennnniferkuang/Out-of-Sight" target="_blank">Repo</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='scroll-section'>
                        <div className="gallery-canvas">
                            {RENDER_GALLERY_FRAMES ? <GalleryFrames config={galleryRooms[4]} /> : null}
                            <div className='gallery-room-content flex flex-col gap-3 p-6' data-gallery-obstacle style={{ justifyItems: 'center', alignItems: 'center' }}>
                                <p style={{ textAlign: 'center', fontSize: 'calc(30px * var(--font-scale, 1))' }}>This site is still under construction!</p>
                                <p style={{ textAlign: 'center', fontSize: 'calc(25px * var(--font-scale, 1))' }}>More exciting things to come, but for now, learn more about me by checking out my:</p>
                                <div className='flex flex-row gap-4'>
                                <Button as="a" color='dark' href="https://github.com/jennnniferkuang" target="_blank">GitHub</Button>
                                <Button as="a" color='dark' href="https://devpost.com/jennnniferkuang?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav&_gl=1*1qqzdkq*_gcl_au*Mjc1NTk4NDEuMTc0ODQzNjExMw..*_ga*MTg2NjAyNTM0OC4xNzQ4NDM2MTEz*_ga_0YHJK3Y10M*czE3NTU1Mzc4MDIkbzEyJGcxJHQxNzU1NTM3ODA3JGo1NSRsMCRoMA" target="_blank">Devpost</Button>
                                <Button as="a" color='dark' href="https://drive.google.com/file/d/1XUg5-LMHmn9yxra0V4K48jUq0PasT_Gj/view?usp=drive_link" target="_blank">Resume!</Button>
                                </div>
                                <p style={{ textAlign: 'center', fontSize: 'calc(30px * var(--font-scale, 1))' }}>Other fun places to get to know me:</p>
                                <div className='flex flex-row gap-4'>
                                <Button as="a" color='dark' href="https://steamcommunity.com/id/cornflaekes/" target="_blank">Steam</Button>
                                <Button as="a" color='dark' href="https://open.spotify.com/user/31vscmisfq4qozqjnpr35sdab4qe?si=c3ff83da36ec4390" target="_blank">Spotify</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
