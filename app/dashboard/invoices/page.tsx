import { getInvoices } from '@/app/lib/database/invoice';
import InvoicesTable from '@/app/ui/dashboard/invoices-table';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default async function page() {
  const invoices = await getInvoices();
  const columns = [
    { key: 'id', label: 'UUID' },
    { key: 'company', label: 'Empresa' },
    { key: 'provider', label: 'Proveedor' },
    { key: 'pdf', label: 'PDF' },
    { key: 'xml', label: 'XML' },
    { key: 'actions', label: 'Acciones' },
  ];
  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="mb-4 text-4xl">Facturas</h1>

        <Button
          color="primary"
          variant="flat"
          size="lg"
          type="button"
          href="/dashboard/invoices/create"
          as={Link}
        >
          Cargar factura
          <CloudArrowUpIcon className="w-6" />
        </Button>
      </div>
      <InvoicesTable invoices={invoices} columns={columns} />
    </main>
  );
}
