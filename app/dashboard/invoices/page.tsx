import { getInvoicesByDateRange } from '@/app/lib/actions/invoice.actions';
import PaginationCustom from '@/app/ui/Pagination';
import DateFilter from '@/app/ui/dashboard/date-filter';
import InvoicesTable from '@/app/ui/dashboard/invoices-table';
import SearchFilter from '@/app/ui/dashboard/search-filter';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default async function page({
  searchParams: { startDate, endDate },
}: {
  searchParams: { startDate: string; endDate: string };
}) {
  const invoices = await getInvoicesByDateRange({ startDate, endDate });
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
        <h1 className="text-4xl">Facturas</h1>

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
      <div className="mb-4 flex justify-between rounded-large shadow-sm">
        <SearchFilter data={{ key: 'invoice-search', label: 'Buscar' }} />
        <DateFilter />
      </div>
      <InvoicesTable invoices={invoices} columns={columns} />
      <PaginationCustom limit={10} items={invoices.length} />
    </main>
  );
}
