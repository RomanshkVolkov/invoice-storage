import { getInvoicesByDateRange } from '@/app/lib/actions/invoice.actions';
import PaginationCustom from '@/app/ui/Pagination';
import DateFilter from '@/app/ui/dashboard/date-filter';
import InvoicesTable from '@/app/ui/invoices/table';
import SearchFilter from '@/app/ui/dashboard/search-filter';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default async function page({
  searchParams: { startDate, endDate, items },
}: {
  searchParams: { startDate: string; endDate: string; items: string };
}) {
  const invoices = await getInvoicesByDateRange({ startDate, endDate });
  const columns = [
    { key: 'reference', label: 'Folio' },
    { key: 'typeID', label: 'Tipo' },
    { key: 'company', label: 'Empresa' },
    { key: 'provider', label: 'Proveedor' },
    { key: 'id', label: 'UUID' },
    { key: 'files', label: 'Ver' },
    { key: 'actions', label: 'Acciones' },
  ];
  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl">Facturas</h1>
        <Button
          className="hidden md:flex"
          color="primary"
          variant="flat"
          size="lg"
          type="button"
          href="/dashboard/invoices/create"
          as={Link}
        >
          <span className="hidden md:inline-block">Cargar factura</span>
          <CloudArrowUpIcon className="w-6" />
        </Button>

        <Button
          className="md:hidden "
          color="primary"
          variant="flat"
          size="lg"
          type="button"
          href="/dashboard/invoices/create"
          as={Link}
          isIconOnly
        >
          <CloudArrowUpIcon className="w-6" />
        </Button>
      </div>
      <div className="mb-4 justify-between rounded-large md:flex ">
        <SearchFilter data={{ key: 'invoice-search', label: 'Buscar' }} />
        <DateFilter />
      </div>
      <InvoicesTable invoices={invoices} columns={columns} />
      <PaginationCustom limit={10} items={Number(items || invoices.length)} />
    </main>
  );
}
