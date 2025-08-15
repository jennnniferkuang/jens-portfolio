'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function HorizontalScrollGallery() {

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
                clearTimeout((handleScroll as any).timeout);
                (handleScroll as any).timeout = setTimeout(stopWalking, 200);
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
                    className="absolute left-30 -translate-x-1/2 z-50 w-60"
                    style={{ bottom: '20vh' }}
                    id="sprite"
                />
                <div className="floor z-50" style={{ width: 'totalScroll' }}></div>
                <div className='scroll-section-inner relative' ref={sectionRef}>
                    <div className='scroll-section'>

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