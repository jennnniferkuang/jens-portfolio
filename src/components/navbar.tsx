'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='w-full p-4 flex justify-between bg-black text-white'>
      <p>JENNIFER KUANG</p>
      <div className='flex flex-row gap-4'>
        <Link href='/'>Home</Link>
        <Link href='/commissions'>Commissions</Link>
      </div>
    </nav>
  );
}