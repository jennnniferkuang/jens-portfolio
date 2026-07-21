'use client';

// import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
	return (
		<nav className='navbar fixed'>
			<div className="flex flex-row gap-2 align-items-center justify-content-center">
				<Image className="h-5" src="/key-white.webp" alt="" width={20} height={20} />
				<p>JENNIFER KUANG</p>
			</div>
			{/* <div className='flex flex-row gap-4'>
				<Link className='navbar-text' href='/'>Home</Link>
				<Link className='navbar-text' href='/commissions'>Commissions</Link>
			</div> */}
		</nav>
	);
}