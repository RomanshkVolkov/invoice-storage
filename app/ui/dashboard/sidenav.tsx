import Link from 'next/link';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import NavLinks from './nav-links';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-md bg-primary-500 p-4 md:h-32"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <h1 className="text-center text-xl">Invoice Storage</h1>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block" />
        <form
          action={async () => {
            'use server';
            await signOut({
              redirectTo: '/login',
            });
          }}
        >
          <button className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-primary-500 p-3 text-sm font-medium text-white transition-all hover:bg-sky-100 hover:text-primary-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Cerrar sesión</div>
          </button>
        </form>
      </div>
    </div>
  );
}
