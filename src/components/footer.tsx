'use client';

import Image from 'next/image';

export default function Footer() {
    return (
        <footer className='fixed bg-white'>
            <div>
                <div className='flex justify-end space-x-2'>
                    <a href='https://www.linkedin.com/in/jenniferkuang06/' target="_blank" className='p-2'>
                        <Image className='h-8' src='https://camelai.com/assets/images/linkedin.png' alt="" width={32} height={32} />
                    </a>
                    <a href='https://github.com/jennnniferkuang' target="_blank" className='p-2'>
                        <Image className='h-8' src='https://camelai.com/assets/images/github.png' alt="" width={32} height={32} />
                    </a>
                </div>
            </div>
        </footer>
    );
}