import Link from 'next/link';

import ProvidersTable from '@/app/ui/dashboard/providers-table';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { getProviders } from '@/app/lib/database/providers';

const columns = [
  { key: 'rfc', label: 'RFC' },
  { key: 'name', label: 'NOMBRE' },
  { key: 'zipcode', label: 'CÓDIGO POSTAL' },
  { key: 'email', label: 'EMAIL' },
  { key: 'actions', label: 'ACCIONES' },
];

export default async function Providers() {
  const providers = await getProviders();
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
