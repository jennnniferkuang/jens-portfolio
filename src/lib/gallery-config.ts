import type {
  GalleryRoomConfig,
  NormalizedRect,
} from "@/lib/gallery-placement";

export type GalleryRoomSettings = Omit<GalleryRoomConfig, "images">;

const EDGE_ZONES: NormalizedRect[] = [
  { x: 3, y: 8, width: 24, height: 84 },
  { x: 73, y: 8, width: 24, height: 84 },
  { x: 27, y: 3, width: 46, height: 24 },
  { x: 27, y: 73, width: 46, height: 24 },
];

export const GALLERY_ROOM_SETTINGS: GalleryRoomSettings[] = [
  {
    id: "welcome",
    count: 4,
    preferredWidth: 16,
    minWidth: 9,
    allowedZones: EDGE_ZONES,
  },
  {
    id: "about",
    count: 3,
    preferredWidth: 14,
    minWidth: 8,
    allowedZones: EDGE_ZONES,
  },
  {
    id: "music",
    count: 2,
    preferredWidth: 12,
    minWidth: 7,
    allowedZones: EDGE_ZONES,
  },
  {
    id: "fun-fact",
    count: 3,
    preferredWidth: 14,
    minWidth: 8,
    allowedZones: EDGE_ZONES,
  },
  {
    id: "links",
    count: 3,
    preferredWidth: 14,
    minWidth: 8,
    allowedZones: EDGE_ZONES,
  },
];

export const TOTAL_GALLERY_PICTURES = GALLERY_ROOM_SETTINGS.reduce(
  (total, room) => total + room.count,
  0,
);
