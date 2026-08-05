'use client';

import Image from 'next/image';
import { type RefObject, useEffect, useRef } from 'react';

const SPRITE_PATHS = [
  '/stationary.webp',
  '/walk-1.webp',
  '/walk-2.webp',
  '/walk-3.webp',
];

function useWalkerAnimation(spriteRef: RefObject<HTMLImageElement | null>) {
  useEffect(() => {
    const sprite = spriteRef.current;

    if (!sprite) {
      return;
    }

    SPRITE_PATHS.forEach((src) => {
      const image = new window.Image();
      image.src = src;
    });

    const reducedMotionQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    let reducedMotion = reducedMotionQuery.matches;
    let lastScrollY = window.scrollY;
    let frame = 0;
    let isWalking = false;
    let walkInterval: ReturnType<typeof setInterval> | null = null;
    let stopTimeout: ReturnType<typeof setTimeout> | null = null;

    const stopWalking = () => {
      isWalking = false;
      sprite.src = '/stationary.webp';

      if (walkInterval) {
        clearInterval(walkInterval);
        walkInterval = null;
      }
    };

    const updateFrame = () => {
      frame = (frame % 3) + 1;
      sprite.src = `/walk-${frame}.webp`;
    };

    const startWalking = () => {
      if (isWalking || reducedMotion) {
        return;
      }

      isWalking = true;
      updateFrame();
      walkInterval = setInterval(updateFrame, 120);
    };

    const handleScroll = () => {
      const nextScrollY = window.scrollY;
      const delta = nextScrollY - lastScrollY;

      if (delta > 1) {
        sprite.style.setProperty('--walker-facing', '1');
      } else if (delta < -1) {
        sprite.style.setProperty('--walker-facing', '-1');
      }

      if (Math.abs(delta) > 2 && !reducedMotion) {
        startWalking();

        if (stopTimeout) {
          clearTimeout(stopTimeout);
        }

        stopTimeout = setTimeout(stopWalking, 200);
      }

      lastScrollY = nextScrollY;
    };

    const handleReducedMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;

      if (reducedMotion) {
        stopWalking();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      reducedMotionQuery.removeEventListener(
        'change',
        handleReducedMotionChange,
      );
      stopWalking();

      if (stopTimeout) {
        clearTimeout(stopTimeout);
      }
    };
  }, [spriteRef]);
}

export default function PersistentStage() {
  const spriteRef = useRef<HTMLImageElement | null>(null);

  useWalkerAnimation(spriteRef);

  return (
    <div className="persistent-stage" aria-hidden="true">
      <div className="floor">
        <div className="walker-anchor left-15 sm:left-30">
          <Image
            src="/stationary.webp"
            className="walker w-30 sm:w-60"
            ref={spriteRef}
            alt=""
            width={100}
            height={100}
            loading="eager"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}
