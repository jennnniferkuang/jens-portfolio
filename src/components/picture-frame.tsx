'use client';

/* Frame sizes:
1 -> 1x1 white
2 -> 2x3 white
3 -> 3x2 white (2x3 rotated)
*/

// parameters in relation to vh and vw
export default function PictureFrame({
    imgSrc = '/me.png',
    frame = 1,
    width = 10,
    yPos = 10,
    xPos = 10,
}) {

    let frameSrc = '/frame1x1-white.webp';
    let scale = 0.6;
    let rotation = '0deg';

    switch(frame) {
        case(3): // 3x2
            frameSrc = '/frame2x3-white.webp';
            scale = 0.75;
            rotation = '90deg';
            break;
        case (2): // 2x3
            frameSrc = '/frame2x3-white.webp';
            scale = 0.75;
            break;
        case (1): // 1x1
        default:
            frameSrc = '/frame1x1-white.webp';
            scale = 0.6;
            break;
    }

    return (
        <div
            className="absolute"
            style={{
            top: `${yPos}vh`,
            left: `${xPos}vw`,
            width: `${width}vw`,
            transform: `translate(-50%, -50%) rotate(${rotation})`, // center the container
            }}>

            {/* Frame */}
            <img src={frameSrc} className="w-full relative z-1"/>

            {/* Inner picture */}
            <img
            src={imgSrc}
            className="absolute inset-0 m-auto z-0"
            style={{
                width: `${scale * 100}%`,
                height: 'auto',
            }}/>
        </div>
    );
}
