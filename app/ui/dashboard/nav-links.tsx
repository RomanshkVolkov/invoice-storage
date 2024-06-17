'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Facturas',
    href: '/dashboard/invoices',
    icon: DocumentDuplicateIcon,
  },
  {
    name: 'Proveedores',
    href: '/dashboard/providers',
    icon: UserGroupIcon,
    isAdminRoute: true,
  },
  {
    name: 'Empresas',
    href: '/dashboard/companies',
    icon: BuildingOffice2Icon,
    isAdminRoute: true,
  },
];

export default function NavLinks({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  const filteredLinks = [...links].filter((link) => {
    if (link.isAdminRoute) {
      return userRole.toLowerCase() === 'admin';
    }
    return true;
  });

  return (
    <>
      {filteredLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-lg bg-background p-3 text-sm font-medium hover:bg-sky-100 hover:text-primary-600  dark:hover:bg-sky-950 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-primary-600 dark:bg-sky-950':
                  pathname === link.href,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
