'use client';

import { Children, type ReactNode, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

type HorizontalScrollSectionProps = {
  children: ReactNode;
};

export default function HorizontalScrollSection({
  children,
}: HorizontalScrollSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) {
      return;
    }

    const section = sectionRef.current;
    const track = trackRef.current;
    const getScrollDistance = () =>
      Math.max(0, track.scrollWidth - section.clientWidth);
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const context = gsap.context(() => {
      gsap.fromTo(
        track,
        { x: 0 },
        {
          x: () => -getScrollDistance(),
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            scrub: reducedMotion ? true : 0.6,
            pin: section,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        },
      );
    }, section);

    let refreshFrame: number | null = null;
    const scheduleRefresh = () => {
      if (refreshFrame !== null) {
        cancelAnimationFrame(refreshFrame);
      }

      refreshFrame = requestAnimationFrame(() => {
        refreshFrame = null;
        ScrollTrigger.refresh();
      });
    };
    const resizeObserver = new ResizeObserver(scheduleRefresh);

    resizeObserver.observe(track);
    window.addEventListener('orientationchange', scheduleRefresh);
    document.fonts?.ready.then(scheduleRefresh);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('orientationchange', scheduleRefresh);

      if (refreshFrame !== null) {
        cancelAnimationFrame(refreshFrame);
      }

      context.revert();
    };
  }, []);

  const rooms = Children.toArray(children).map((room, index) => (
    <div className="horizontal-scroll-room" key={index}>
      {room}
    </div>
  ));

  return (
    <section ref={sectionRef} className="horizontal-scroll-section">
      <div ref={trackRef} className="horizontal-scroll-track">
        {rooms}
      </div>
    </section>
  );
}
