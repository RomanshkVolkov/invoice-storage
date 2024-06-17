import Link from 'next/link';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import SearchFilter from '@/app/ui/dashboard/search-filter';
import TableWrapper from '@/app/ui/dashboard/companies/table-wrapper';

export default function Companies() {
  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl">Empresas</h1>
        <Button
          className="hidden md:flex"
          color="primary"
          variant="flat"
          size="lg"
          type="button"
          href="/dashboard/providers/create"
          as={Link}
        >
          Crear empresa
          <PlusIcon className="w-6" />
        </Button>

        <Button
          className="md:hidden "
          color="primary"
          variant="flat"
          size="lg"
          type="button"
          href="/dashboard/providers/create"
          as={Link}
          isIconOnly
        >
          <PlusIcon className="w-6" />
        </Button>
      </div>
      <div className="mb-4">
        <SearchFilter data={{ key: 'query', label: 'Buscar' }} />
      </div>
      <TableWrapper />
    </main>
  );
}
