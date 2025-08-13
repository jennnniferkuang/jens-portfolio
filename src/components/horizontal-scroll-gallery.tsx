'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function HorizontalScrollGallery() {

    const sectionRef = useRef(null);
    const triggerRef = useRef(null);

    gsap.registerPlugin(ScrollTrigger);

    useEffect(() => {
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

            if (Math.abs(delta) > 1) {
                startWalking();
                clearTimeout((handleScroll as any).timeout);
                (handleScroll as any).timeout = setTimeout(stopWalking, 200);
            }

            lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', handleScroll);

        const pin = gsap.fromTo(sectionRef.current, {
            translateX: 0
        }, {
            translateX: '-200vw',
            ease: 'none',
            duration: 1,
            scrollTrigger: {
                trigger: triggerRef.current,
                start: 'top top',
                end: '2000 top',
                scrub: 0.6,
                pin: true
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
                    className="absolute bottom-50 left-50 -translate-x-1/2 z-50 w-60 scale-x-[-1]"
                    id="sprite"
                />
                <div className='scroll-section-inner relative' ref={sectionRef}>
                    <div className='scroll-section'>
                        <img className="h-full w-full" src="/background.jpg"></img>
                    </div>
                    <div className='scroll-section'>
                        <img className="h-full w-full" src="/background.jpg"></img>
                    </div>
                    <div className='scroll-section'>
                        <img className="h-full w-full" src="/background.jpg"></img>
                    </div>
                </div>
            </div>
        </section>
    );
}