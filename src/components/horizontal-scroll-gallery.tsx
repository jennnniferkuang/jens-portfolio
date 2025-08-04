'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function HorizontalScrollGallery() {

    const sectionRef = useRef(null);
    const triggerRef = useRef(null);

    gsap.registerPlugin(ScrollTrigger);

    useEffect(() => {
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
        }
    }, [])

    return (
        <section className='scroll-section-outer'>
            <div ref={triggerRef}>
                <div className='scroll-section-inner' ref={sectionRef}>
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