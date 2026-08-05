"use client";

import Image from "next/image";

import {
    GalleryFrameVariant,
    getGalleryFrameVariant,
} from "@/lib/gallery-placement";
import type { ImageModel } from "@/models";

type PictureFrameProps = {
    image: ImageModel;
    imgSrc: string;
    frameWidth: number;
    x: number;
    y: number;
};

// Position and frame width are pixels within the nearest gallery canvas.
export default function PictureFrame({
    image,
    imgSrc,
    frameWidth,
    x,
    y,
}: PictureFrameProps) {
    const frame = getGalleryFrameVariant(image);
    let frameSrc = "/frame1x1-white.webp";
    let pictureWidth = 60;
    let pictureHeight = 60;
    let frameRotation = "0deg";

    switch(frame) {
        case GalleryFrameVariant.LANDSCAPE:
            frameSrc = "/frame2x3-white.webp";
            pictureWidth = 74;
            pictureHeight = 49;
            break;
        case GalleryFrameVariant.PORTRAIT:
            frameSrc = "/frame2x3-white.webp";
            pictureWidth = 49;
            pictureHeight = 74;
            frameRotation = "90deg";
            break;
        case GalleryFrameVariant.SQUARE:
        default:
            frameSrc = "/frame1x1-white.webp";
            break;
    }

    return (
        <div
            className="absolute aspect-square"
            data-gallery-frame
            style={{
                top: `${y}px`,
                left: `${x}px`,
                width: `${frameWidth}px`,
                transform: "translate(-50%, -50%)",
            }}>

            {/* Frame */}
            <Image
                src={frameSrc}
                className="relative z-1 size-full"
                style={{ transform: `rotate(${frameRotation})` }}
                alt=""
                width={769}
                height={769}
                sizes={`${Math.ceil(frameWidth)}px`}
            />

            {/* Inner picture */}
            <Image
                src={imgSrc}
                className="absolute inset-0 z-0 m-auto object-cover"
                style={{
                    width: `${pictureWidth}%`,
                    height: `${pictureHeight}%`,
                }}
                alt={image.alt_text ?? ""}
                width={image.width}
                height={image.height}
                sizes={`${Math.ceil(frameWidth)}px`}
            />
        </div>
    );
}
