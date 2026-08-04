'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	const closeMenu = () => setIsMenuOpen(false);

	return (
		<nav className={`navbar fixed items-center ${isMenuOpen ? 'bg-white text-black md:bg-transparent md:text-white' : 'bg-transparent text-white'}`}>
			<Link href='/'>
				<div className="flex flex-row items-center justify-center gap-2">
					<Image className={`h-5 w-auto ${isMenuOpen ? 'invert md:invert-0' : ''}`} src="/key-white.webp" alt="" width={20} height={20} />
					<p>JENNIFER KUANG</p>
				</div>
			</Link>
			<div className='hidden flex-row gap-4 md:flex'>
				<Link className='navbar-text' href='/journal'>Journal</Link> 
				{/* <Link className='navbar-text' href='/payments'>Payments</Link> */}
			</div>
			<button
				type='button'
				className='flex size-10 items-center justify-center md:hidden'
				aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
				aria-expanded={isMenuOpen}
				aria-controls='mobile-navigation'
				onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
			>
				{isMenuOpen ? <X aria-hidden='true' /> : <Menu aria-hidden='true' />}
			</button>
			{isMenuOpen && (
				<div
					id='mobile-navigation'
					className='absolute inset-x-0 top-full flex w-full flex-col bg-white p-2 shadow-lg md:hidden'
				>
					<Link className='px-3 py-2 text-black' href='/journal' onClick={closeMenu}>Journal</Link>
					{/* <Link className='px-3 py-2 text-black' href='/payments' onClick={closeMenu}>Payments</Link> */}
				</div>
			)}
		</nav>
	);
}
