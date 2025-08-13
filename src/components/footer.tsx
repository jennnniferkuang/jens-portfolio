'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className='bg-white'>
            <div>
                <div className='flex justify-end space-x-2'>
                    <a href='https://www.linkedin.com/in/jenniferkuang06/' target="_blank" className='p-2'>
                        <img className='h-8' src='https://camelai.com/assets/images/linkedin.png'></img>
                    </a>
                    <a href='https://github.com/jennnniferkuang' target="_blank" className='p-2'>
                        <img className='h-8' src='https://camelai.com/assets/images/github.png'></img>
                    </a>
                </div>
            </div>
        </footer>
    );
}