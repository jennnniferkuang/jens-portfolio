export enum GalleryFrameVariant {
  SQUARE = "square",
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

export type GalleryImage = {
  src: string;
  naturalWidth: number;
  naturalHeight: number;
};

export type NormalizedRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type GalleryRoomConfig = {
  id: string;
  images: GalleryImage[];
  count: number;
  preferredWidth: number;
  minWidth: number;
  allowedZones?: NormalizedRect[];
};

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type PlacedGalleryFrame = GalleryImage & {
  id: string;
  x: number;
  y: number;
  width: number;
};

type PlacementOptions = {
  canvasWidth: number;
  canvasHeight: number;
  obstacles: Rect[];
  viewportWidth: number;
  viewportHeight: number;
};

const OBSTACLE_CLEARANCE = 32;
const FRAME_GAP = 16;
const CANVAS_INSET = 12;
const MAX_LOCATION_ATTEMPTS = 120;
const SHRINK_FACTOR = 0.9;

function hashString(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function createRandom(seed: number) {
  let value = seed;

  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function expandRect(rect: Rect, amount: number): Rect {
  return {
    left: rect.left - amount,
    top: rect.top - amount,
    right: rect.right + amount,
    bottom: rect.bottom + amount,
  };
}

function rectsOverlap(first: Rect, second: Rect) {
  return !(
    first.right <= second.left ||
    first.left >= second.right ||
    first.bottom <= second.top ||
    first.top >= second.bottom
  );
}

function isInsideCanvas(
  rect: Rect,
  canvasWidth: number,
  canvasHeight: number,
) {
  return (
    rect.left >= CANVAS_INSET &&
    rect.top >= CANVAS_INSET &&
    rect.right <= canvasWidth - CANVAS_INSET &&
    rect.bottom <= canvasHeight - CANVAS_INSET
  );
}

function shuffledImages(images: GalleryImage[], random: () => number) {
  const result = [...images];

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

function sizesBetween(preferred: number, minimum: number) {
  const sizes = [preferred];
  let current = preferred;

  while (current * SHRINK_FACTOR > minimum) {
    current *= SHRINK_FACTOR;
    sizes.push(current);
  }

  if (sizes[sizes.length - 1] !== minimum) {
    sizes.push(minimum);
  }

  return sizes;
}

function validateConfig(config: GalleryRoomConfig) {
  if (
    config.minWidth <= 0 ||
    config.preferredWidth <= 0 ||
    config.minWidth > config.preferredWidth
  ) {
    throw new RangeError(
      `Gallery room "${config.id}" requires 0 < minWidth <= preferredWidth.`,
    );
  }
}

function candidateCenter(
  zone: NormalizedRect,
  canvasWidth: number,
  canvasHeight: number,
  random: () => number,
) {
  return {
    x: ((zone.x + random() * zone.width) / 100) * canvasWidth,
    y: ((zone.y + random() * zone.height) / 100) * canvasHeight,
  };
}

export function placeGalleryFrames(
  config: GalleryRoomConfig,
  {
    canvasWidth,
    canvasHeight,
    obstacles,
    viewportWidth,
    viewportHeight,
  }: PlacementOptions,
): PlacedGalleryFrame[] {
  validateConfig(config);

  if (
    config.count <= 0 ||
    config.images.length === 0 ||
    canvasWidth <= 0 ||
    canvasHeight <= 0
  ) {
    return [];
  }

  const random = createRandom(
    hashString(`${config.id}:${viewportWidth}x${viewportHeight}`),
  );
  const images = shuffledImages(config.images, random);
  const zones =
    config.allowedZones?.length
      ? config.allowedZones
      : [{ x: 0, y: 0, width: 100, height: 100 }];
  const blockedRects = obstacles.map((rect) =>
    expandRect(rect, OBSTACLE_CLEARANCE),
  );
  const preferredWidth = (config.preferredWidth / 100) * canvasWidth;
  const minimumWidth = (config.minWidth / 100) * canvasWidth;
  const candidateSizes = sizesBetween(preferredWidth, minimumWidth);
  const placedRects: Rect[] = [];
  const placements: PlacedGalleryFrame[] = [];

  const requestedCount = Math.min(config.count, images.length);

  for (let frameIndex = 0; frameIndex < requestedCount; frameIndex += 1) {
    const image = images[frameIndex];
    let placement: PlacedGalleryFrame | null = null;

    for (
      let attempt = 0;
      attempt < MAX_LOCATION_ATTEMPTS && !placement;
      attempt += 1
    ) {
      const zone = zones[Math.floor(random() * zones.length)];
      const center = candidateCenter(
        zone,
        canvasWidth,
        canvasHeight,
        random,
      );

      for (const width of candidateSizes) {
        const halfWidth = width / 2;
        const rect = {
          left: center.x - halfWidth,
          top: center.y - halfWidth,
          right: center.x + halfWidth,
          bottom: center.y + halfWidth,
        };

        const collidesWithObstacle = blockedRects.some((obstacle) =>
          rectsOverlap(rect, obstacle),
        );
        const collidesWithFrame = placedRects.some((placedRect) =>
          rectsOverlap(expandRect(rect, FRAME_GAP), placedRect),
        );

        if (
          isInsideCanvas(rect, canvasWidth, canvasHeight) &&
          !collidesWithObstacle &&
          !collidesWithFrame
        ) {
          placement = {
            ...image,
            id: `${config.id}-${frameIndex}`,
            x: center.x,
            y: center.y,
            width,
          };
          placedRects.push(rect);
          break;
        }
      }
    }

    if (placement) {
      placements.push(placement);
    }
  }

  return placements;
}
