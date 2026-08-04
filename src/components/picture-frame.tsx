"use client";

import Image from "next/image";

import { GalleryFrameVariant } from "@/lib/gallery-placement";

type PictureFrameProps = {
    imgSrc?: string;
    imageWidth?: number;
    imageHeight?: number;
    width?: number;
    x?: number;
    y?: number;
};

function getFrameVariant(
    imageWidth: number,
    imageHeight: number,
): GalleryFrameVariant {
    const aspectRatio = imageWidth / imageHeight;
    console.log(aspectRatio);

    if (aspectRatio > 1.2) {
        return GalleryFrameVariant.PORTRAIT;
    }

    if (aspectRatio < 0.8) {
        return GalleryFrameVariant.LANDSCAPE;
    }

    return GalleryFrameVariant.SQUARE;
}

// Position and width parameters are pixels within the nearest gallery canvas.
export default function PictureFrame({
    imgSrc = "/stationary.webp",
    imageWidth = 1,
    imageHeight = 1,
    width = 160,
    x = 0,
    y = 0,
}: PictureFrameProps) {
    const frame = getFrameVariant(imageWidth, imageHeight);
    let frameSrc = "/frame1x1-white.webp";
    let pictureWidth = 60;
    let pictureHeight = 60;
    let frameRotation = "0deg";

    switch(frame) {
        case GalleryFrameVariant.LANDSCAPE:
            frameSrc = "/frame2x3-white.webp";
            pictureWidth = 49;
            pictureHeight = 74;
            frameRotation = "90deg";
            break;
        case GalleryFrameVariant.PORTRAIT:
            frameSrc = "/frame2x3-white.webp";
            pictureWidth = 74;
            pictureHeight = 49;
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
                width: `${width}px`,
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
                sizes={`${Math.ceil(width)}px`}
            />

            {/* Inner picture */}
            <Image
                src={imgSrc}
                className="absolute inset-0 z-0 m-auto object-cover"
                style={{
                    width: `${pictureWidth}%`,
                    height: `${pictureHeight}%`,
                }}
                alt=""
                width={769}
                height={769}
                sizes={`${Math.ceil(width)}px`}
            />
        </div>
    );
}
