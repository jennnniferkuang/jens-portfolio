'use client';

import { type ReactNode, useMemo } from 'react';
import { Button } from 'flowbite-react';

import GalleryFrames from '@/components/gallery-frames';
import PersistentStage from '@/components/persistent-stage';
import VerticalCorridorSection from '@/components/vertical-corridor-section';
import { GALLERY_ROOM_SETTINGS } from '@/lib/gallery-config';
import type {
  GalleryImage,
  GalleryRoomConfig,
} from '@/lib/gallery-placement';
import Masonry from '@/components/Masonry';

type PortfolioScrollExperienceProps = {
  galleryImages: GalleryImage[];
};

type GalleryRoomSceneProps = {
  children: ReactNode;
  config: GalleryRoomConfig;
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

    const roomEnd = Math.min(sourceIndex + room.count, galleryImages.length);
    room.images.push(...galleryImages.slice(sourceIndex, roomEnd));
    sourceIndex = roomEnd;
  }

  return rooms;
}

function GalleryRoomScene({ children, config }: GalleryRoomSceneProps) {
  return (
    <div className="gallery-canvas">
      {RENDER_GALLERY_FRAMES ? <GalleryFrames config={config} /> : null}
      {children}
    </div>
  );
}

type MasonryItem = {
  id: string;
  img: string;
  url?: string;
  width: number;
  height: number;
};

function getMasonryItems(images: GalleryImage[]): MasonryItem[] {
  const items: MasonryItem[] = [];
  for (const image of images) {
    items.push({
      id: image.image.id,
      img: image.src,
      url: image.src,
      width: image.image.width,
      height: image.image.height,
    });
  }
  return items;
}

export default function PortfolioScrollExperience({
  galleryImages,
}: PortfolioScrollExperienceProps) {
  const galleryRooms = useMemo(
    () => distributeImagesAcrossRooms(galleryImages),
    [galleryImages],
  );
  const masonryItems = useMemo(
    () => getMasonryItems(galleryImages),
    [galleryImages],
  );

  return (
    <main className="portfolio-scroll-experience">
      <PersistentStage />

      <VerticalCorridorSection
        entryRooms={[
        <GalleryRoomScene config={galleryRooms[0]} key="welcome">
          <div
            className="gallery-room-content flex flex-col gap-2"
            data-gallery-obstacle
          >
            <p
              style={{
                fontSize: 'calc(100px * var(--font-scale, 1))',
                textAlign: 'center',
              }}
            >
              Hi! I’m Jen!
            </p>
            <p
              style={{
                textAlign: 'center',
                fontSize: 'calc(20px * var(--font-scale, 1))',
              }}
            >
              scroll down to explore the exhibit
            </p>
          </div>
        </GalleryRoomScene>,

        <GalleryRoomScene config={galleryRooms[1]} key="about">
          <div
            className="gallery-room-content flex flex-col gap-3 p-6"
            data-gallery-obstacle
            style={{ justifyItems: 'center' }}
          >
            <p
              style={{
                textAlign: 'start',
                fontSize: 'calc(25px * var(--font-scale, 1))',
              }}
            >
              About Me:
            </p>
            <ul>
              <li
                style={{
                  textAlign: 'start',
                  fontSize: 'calc(20px * var(--font-scale, 1))',
                }}
              >
                I’m a 2nd year software engineering student at the University
                of Waterloo
              </li>
              <li
                style={{
                  textAlign: 'start',
                  fontSize: 'calc(20px * var(--font-scale, 1))',
                }}
              >
                I’m currently on a gap year working as a founding engineer at a
                startup called Otto-SR
              </li>
              <li
                style={{
                  textAlign: 'start',
                  fontSize: 'calc(20px * var(--font-scale, 1))',
                }}
              >
                I luv making/playing video games
              </li>
              <li
                style={{
                  textAlign: 'start',
                  fontSize: 'calc(20px * var(--font-scale, 1))',
                }}
              >
                I luv skiing and biking and adventuring
              </li>
              <li
                style={{
                  textAlign: 'start',
                  fontSize: 'calc(20px * var(--font-scale, 1))',
                }}
              >
                I do art and I love crafting (making a sister art site soon!)
              </li>
            </ul>
          </div>
        </GalleryRoomScene>,
        ]}
        verticalRoom={
        <GalleryRoomScene config={galleryRooms[2]} key="vertical">
          <div className="gallery-room-content flex w-full flex-col gap-3 p-6" data-gallery-obstacle>
            <Masonry items={masonryItems} />
          </div>
        </GalleryRoomScene>
        }
        exitRooms={[
          <GalleryRoomScene config={galleryRooms[3]} key="playlists">
          <div
            className="gallery-room-content flex flex-col gap-4 md:flex-row"
            data-gallery-obstacle
          >
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex flex-col gap-3">
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: 'calc(30px * var(--font-scale, 1))',
                  }}
                >
                  My favourite songs :P
                </p>
                <iframe
                  data-testid="embed-iframe"
                  className="spotify-embed"
                  src="https://open.spotify.com/embed/playlist/4BysGnIA94cTXlFrhoXGen?utm_source=generator"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col gap-3">
                <p
                  style={{
                    textAlign: 'center',
                    fontSize: 'calc(30px * var(--font-scale, 1))',
                  }}
                >
                  Losercore Computer Playlist
                </p>
                <iframe
                  data-testid="embed-iframe"
                  className="spotify-embed"
                  src="https://open.spotify.com/embed/playlist/7JNWAdUP3DNIM3vpctdw93?utm_source=generator"
                  frameBorder="0"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </GalleryRoomScene>,
        <GalleryRoomScene config={galleryRooms[4]} key="fun-fact">
          <div
            className="gallery-room-content flex flex-col gap-3 p-6"
            data-gallery-obstacle
            style={{ justifyItems: 'center', alignItems: 'center' }}
          >
            <p
              style={{
                textAlign: 'center',
                fontSize: 'calc(50px * var(--font-scale, 1))',
              }}
            >
              Fun Fact!
            </p>
            <p
              style={{
                textAlign: 'center',
                fontSize: 'calc(25px * var(--font-scale, 1))',
              }}
            >
              This site is a tribute to my first EVER game called Out of Sight,
              a 2D horror platformer which is a totally dookie piece of code,
              but it still means a lot to me to this day! You can check it out
              here:
            </p>
            <div className="flex flex-row gap-4">
              <Button
                as="a"
                color="dark"
                href="https://youtu.be/wUkGteWnN54"
                target="_blank"
              >
                Demo
              </Button>
              <Button
                as="a"
                color="dark"
                href="https://github.com/jennnniferkuang/Out-of-Sight"
                target="_blank"
              >
                Repo
              </Button>
            </div>
          </div>
        </GalleryRoomScene>,

        <GalleryRoomScene config={galleryRooms[5]} key="links">
          <div
            className="gallery-room-content flex flex-col gap-3 p-6"
            data-gallery-obstacle
            style={{ justifyItems: 'center', alignItems: 'center' }}
          >
            <p
              style={{
                textAlign: 'center',
                fontSize: 'calc(30px * var(--font-scale, 1))',
              }}
            >
              This site is still under construction!
            </p>
            <p
              style={{
                textAlign: 'center',
                fontSize: 'calc(25px * var(--font-scale, 1))',
              }}
            >
              More exciting things to come, but for now, learn more about me by
              checking out my:
            </p>
            <div className="flex flex-row gap-4">
              <Button
                as="a"
                color="dark"
                href="https://github.com/jennnniferkuang"
                target="_blank"
              >
                GitHub
              </Button>
              <Button
                as="a"
                color="dark"
                href="https://devpost.com/jennnniferkuang?ref_content=user-portfolio&ref_feature=portfolio&ref_medium=global-nav&_gl=1*1qqzdkq*_gcl_au*Mjc1NTk4NDEuMTc0ODQzNjExMw..*_ga*MTg2NjAyNTM0OC4xNzQ4NDM2MTEz*_ga_0YHJK3Y10M*czE3NTU1Mzc4MDIkbzEyJGcxJHQxNzU1NTM3ODA3JGo1NSRsMCRoMA"
                target="_blank"
              >
                Devpost
              </Button>
              <Button
                as="a"
                color="dark"
                href="https://drive.google.com/file/d/1XUg5-LMHmn9yxra0V4K48jUq0PasT_Gj/view?usp=drive_link"
                target="_blank"
              >
                Resume!
              </Button>
            </div>
            <p
              style={{
                textAlign: 'center',
                fontSize: 'calc(30px * var(--font-scale, 1))',
              }}
            >
              Other fun places to get to know me:
            </p>
            <div className="flex flex-row gap-4">
              <Button
                as="a"
                color="dark"
                href="https://steamcommunity.com/id/cornflaekes/"
                target="_blank"
              >
                Steam
              </Button>
              <Button
                as="a"
                color="dark"
                href="https://open.spotify.com/user/31vscmisfq4qozqjnpr35sdab4qe?si=c3ff83da36ec4390"
                target="_blank"
              >
                Spotify
              </Button>
            </div>
          </div>
        </GalleryRoomScene>,
        ]}
      />
    </main>
  );
}
