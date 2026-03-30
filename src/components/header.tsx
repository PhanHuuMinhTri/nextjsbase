import Link from 'next/link';
import React from 'react';
import { cookies } from 'next/headers';

export default function Header() {
  return (
    <div>
      <ul className="flex justify-end gap-5 p-5">
        <li>
          <Link
            className="flex justify-center bg-gray-400 p-2 w-25 h-11.25 hover:bg-amber-200"
            href={'/login'}
          >
            Login
          </Link>
        </li>
        <li>
          <Link
            className=" flex justify-center  bg-gray-400 p-2 w-25 h-11.25 hover:bg-amber-200"
            href={'/register'}
          >
            Register
          </Link>
        </li>
      </ul>
    </div>
  );
}
