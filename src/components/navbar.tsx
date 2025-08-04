'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className='navbar fixed'>
      <p>JENNIFER KUANG</p>
      <div className='flex flex-row gap-4'>
        <Link className='navbar-text' href='/'>Home</Link>
        <Link className='navbar-text' href='/commissions'>Commissions</Link>
      </div>
    </nav>
  );
}