import Link from 'next/link';

import ProvidersTable from '@/app/ui/dashboard/providers-table';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';

const providers = [
  {
    id: 1,
    rfc: 'ABC123',
    name: 'Provider 1',
    zipcode: '12345',
  },
  {
    id: 2,
    rfc: 'DEF456',
    name: 'Provider 2',
    zipcode: '67890',
  },
  {
    id: 3,
    rfc: 'GHI789',
    name: 'Provider 3',
    zipcode: '12345',
  },
];

const columns = [
  { key: 'rfc', label: 'RFC' },
  { key: 'name', label: 'NOMBRE' },
  { key: 'zipcode', label: 'CÓDIGO POSTAL' },
  { key: 'actions', label: 'ACCIONES' },
];

export default function Providers() {
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

      <ProvidersTable providers={providers} columns={columns} />
    </main>
  );
}
