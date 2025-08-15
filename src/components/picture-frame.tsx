'use client';

/* Frame sizes:
1 -> 1x1
2 -> 2x3
*/

export default function PictureFrame({ imgSrc ='/me.png', frame = 1, width = 200, top = 100, left = 75}) { // fallback defaults

    let imageWidth, imageTop, imageLeft;

    switch (frame) {
        case (1):
            imageWidth = width * (3/5);
            imageTop = top + ((width - imageWidth) / 2);
            imageLeft = left + ((width - imageWidth) / 2);
            break;
        case (2):
            imageWidth = width * (3/4);
            imageTop = top + (width - imageWidth);
            imageLeft = left + ((width - imageWidth) / 2);
    }

    return (
        <div>
            {frame === 2 ? (
                <img
                    src="/frame2x3-white.webp"
                    className="absolute z-2"
                    style={{ top: top.toString() + 'px', left: left.toString() + 'px', width: width.toString() + 'px' }}
                />
            ) : (
                <img
                    src="/frame1x1-white.webp"
                    className="absolute z-2"
                    style={{ top: top.toString() + 'px', left: left.toString() + 'px', width: width.toString() + 'px' }}
                />
            )}
            <img
                src={imgSrc}
                className="absolute z-3"
                style={{ top: imageTop.toString() + 'px', left: imageLeft.toString() + 'px', width: imageWidth.toString() + 'px' }}
            />
        </div>
    );
}