'use client';

import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

type VerticalCorridorSectionProps = {
  entryRooms: ReactNode[];
  verticalRoom: ReactNode;
  exitRooms: ReactNode[];
};

type CorridorMetrics = {
  entryDistance: number;
  exitDistance: number;
  totalDistance: number;
  verticalDistance: number;
};

export default function VerticalCorridorSection({
  entryRooms,
  verticalRoom,
  exitRooms,
}: VerticalCorridorSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const verticalColumnRef = useRef<HTMLDivElement | null>(null);
  const totalColumns = entryRooms.length + 1 + exitRooms.length;
  const sceneStyle = {
    gridTemplateColumns: `repeat(${totalColumns}, 100vw)`,
  } satisfies CSSProperties;

  useEffect(() => {
    if (
      !sectionRef.current ||
      !sceneRef.current ||
      !verticalColumnRef.current
    ) {
      return;
    }

    const section = sectionRef.current;
    const scene = sceneRef.current;
    const verticalColumn = verticalColumnRef.current;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const getMetrics = (): CorridorMetrics => {
      const viewportWidth = window.innerWidth;
      const entryDistance = entryRooms.length * viewportWidth;
      const exitDistance = exitRooms.length * viewportWidth;
      const verticalDistance = Math.max(
        0,
        verticalColumn.scrollHeight - section.clientHeight,
      );

      return {
        entryDistance,
        exitDistance,
        verticalDistance,
        totalDistance: entryDistance + verticalDistance + exitDistance,
      };
    };

    const context = gsap.context(() => {
      const motion = { progress: 0 };

      gsap.to(motion, {
        progress: 1,
        ease: 'none',
        onUpdate: () => {
          const metrics = getMetrics();
          const travelled = motion.progress * metrics.totalDistance;
          let x = 0;
          let y = 0;

          if (travelled <= metrics.entryDistance) {
            x = -travelled;
          } else if (
            travelled <=
            metrics.entryDistance + metrics.verticalDistance
          ) {
            x = -metrics.entryDistance;
            y = -(travelled - metrics.entryDistance);
          } else {
            const exitTravelled =
              travelled - metrics.entryDistance - metrics.verticalDistance;

            x = -(metrics.entryDistance + exitTravelled);
            y = -metrics.verticalDistance;
          }

          gsap.set(scene, { x, y, force3D: true });
        },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getMetrics().totalDistance}`,
          scrub: reducedMotion ? true : 0.6,
          pin: section,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
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

    resizeObserver.observe(verticalColumn);
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
  }, [entryRooms.length, exitRooms.length]);

  return (
    <section ref={sectionRef} className="vertical-corridor-section">
      <div ref={sceneRef} className="vertical-corridor-scene" style={sceneStyle}>
        {entryRooms.map((room, index) => (
          <div
            className="vertical-corridor-panel vertical-corridor-panel--entry"
            key={`entry-${index}`}
            style={{ gridColumn: index + 1 }}
          >
            {room}
          </div>
        ))}

        <div
          ref={verticalColumnRef}
          className="vertical-corridor-column"
          style={{ gridColumn: entryRooms.length + 1 }}
        >
          {verticalRoom}
        </div>

        {exitRooms.map((room, index) => (
          <div
            className="vertical-corridor-panel vertical-corridor-panel--exit"
            key={`exit-${index}`}
            style={{ gridColumn: entryRooms.length + index + 2 }}
          >
            {room}
          </div>
        ))}
      </div>
    </section>
  );
}
