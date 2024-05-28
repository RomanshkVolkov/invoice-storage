import Link from 'next/link';
import { auth, signOut } from '@/auth';
import NavLinks from './nav-links';
import LogoutButton from '../logout-button';
import { redirect } from 'next/navigation';

export default async function SideNav() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

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
        <NavLinks userRole={session.user.type.name} />
        <div className="hidden h-auto w-full grow rounded-lg bg-gray-50 md:block" />
        <form
          action={async () => {
            'use server';
            await signOut({
              redirectTo: '/login',
            });
          }}
        >
          <LogoutButton />
        </form>
      </div>
    </div>
  );
}
