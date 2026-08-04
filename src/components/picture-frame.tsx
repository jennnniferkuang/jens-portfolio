"use client";

import Image from "next/image";

import { GalleryFrameVariant } from "@/lib/gallery-placement";

type PictureFrameProps = {
    imgSrc?: string;
    frame?: GalleryFrameVariant;
    width?: number;
    x?: number;
    y?: number;
};

// Position and width parameters are pixels within the nearest gallery canvas.
export default function PictureFrame({
    imgSrc = "/stationary.webp",
    frame = GalleryFrameVariant.SQUARE,
    width = 160,
    x = 0,
    y = 0,
}: PictureFrameProps) {
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
