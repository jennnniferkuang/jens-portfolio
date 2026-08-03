"use client";

import { useEffect, useRef, useState } from "react";

import PictureFrame from "@/components/picture-frame";
import {
  placeGalleryFrames,
  type GalleryRoomConfig,
  type PlacedGalleryFrame,
  type Rect,
} from "@/lib/gallery-placement";

type GalleryFramesProps = {
  config: GalleryRoomConfig;
};

const DESKTOP_QUERY = "(min-width: 1024px)";

function measureObstacles(canvas: HTMLElement, canvasRect: DOMRect): Rect[] {
  return Array.from(
    canvas.querySelectorAll<HTMLElement>("[data-gallery-obstacle]"),
  ).map((obstacle) => {
    const rect = obstacle.getBoundingClientRect();

    return {
      left: rect.left - canvasRect.left,
      top: rect.top - canvasRect.top,
      right: rect.right - canvasRect.left,
      bottom: rect.bottom - canvasRect.top,
    };
  });
}

export default function GalleryFrames({ config }: GalleryFramesProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [placements, setPlacements] = useState<PlacedGalleryFrame[]>([]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);

    const updateDesktopMode = () => {
      setIsDesktop(mediaQuery.matches);

      if (!mediaQuery.matches) {
        setPlacements([]);
      }
    };

    updateDesktopMode();
    mediaQuery.addEventListener("change", updateDesktopMode);

    return () => mediaQuery.removeEventListener("change", updateDesktopMode);
  }, []);

  useEffect(() => {
    if (!isDesktop || !layerRef.current) {
      return;
    }

    const canvas = layerRef.current.closest<HTMLElement>(".gallery-canvas");

    if (!canvas) {
      return;
    }

    let animationFrame: number | null = null;

    const calculatePlacements = () => {
      const canvasRect = canvas.getBoundingClientRect();

      setPlacements(
        placeGalleryFrames(config, {
          canvasWidth: canvasRect.width,
          canvasHeight: canvasRect.height,
          obstacles: measureObstacles(canvas, canvasRect),
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
        }),
      );
    };

    const schedulePlacement = () => {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(calculatePlacements);
    };

    const resizeObserver = new ResizeObserver(schedulePlacement);
    resizeObserver.observe(canvas);
    canvas
      .querySelectorAll<HTMLElement>("[data-gallery-obstacle]")
      .forEach((obstacle) => resizeObserver.observe(obstacle));

    schedulePlacement();
    document.fonts?.ready.then(schedulePlacement);

    return () => {
      resizeObserver.disconnect();

      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [config, isDesktop]);

  return (
    <div
      ref={layerRef}
      className="gallery-frame-layer pointer-events-none absolute inset-0 z-0 hidden lg:block"
      aria-hidden="true"
    >
      {isDesktop
        ? placements.map((placement) => (
            <PictureFrame
              key={placement.id}
              imgSrc={placement.src}
              frame={placement.frame}
              width={placement.width}
              x={placement.x}
              y={placement.y}
            />
          ))
        : null}
    </div>
  );
}
