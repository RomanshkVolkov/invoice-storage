import Link from 'next/link';

import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import SearchFilter from '@/app/ui/dashboard/search-filter';
import TableWrapper from '@/app/ui/dashboard/providers/table-wrapper';

export default async function Providers() {
  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl">Proveedores</h1>
        <Button
          color="primary"
          variant="flat"
          size="lg"
          type="button"
          href="/dashboard/providers/create"
          as={Link}
        >
          Crear proveedor
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
