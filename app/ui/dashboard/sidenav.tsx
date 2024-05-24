import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from '@/auth';
import NavLinks from './nav-links';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-center justify-center rounded-lg bg-primary-500 p-4 md:h-32"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <h1 className="text-center text-xl">Invoice Storage</h1>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-lg bg-gray-50 md:block" />
        <form
          action={async () => {
            'use server';
            await signOut({
              redirectTo: '/login',
            });
          }}
        >
          <Button
            className="relative flex w-full grow items-center justify-between gap-2 bg-primary-500 text-sm font-medium text-white transition-all md:flex-none md:justify-start"
            size="lg"
          >
            <div className="hidden w-full text-center md:block">
              Cerrar sesión
            </div>
            <PowerIcon className="absolute right-4 ml-auto w-6" />
          </Button>
        </form>
      </div>
    </div>
  );
}
