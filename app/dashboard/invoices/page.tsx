import { getInvoicesByDateRange } from '@/app/lib/actions/invoice.actions';
import DateFilter from '@/app/ui/dashboard/date-filter';
import InvoicesTable from '@/app/ui/invoices/table';
import SearchFilter from '@/app/ui/dashboard/search-filter';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import CompanyFilter from '@/app/ui/dashboard/providers/company-filter';
import getCompanies from '@/app/lib/database/companies';

export default async function page({
  searchParams: { startDate, endDate, company },
}: {
  searchParams: { startDate: string; endDate: string; company: string };
}) {
  const invoices = await getInvoicesByDateRange({
    startDate,
    endDate,
    company,
  });
  const companies = await getCompanies(); // This is a call to the database
  const columns = [
    { key: 'reference', label: 'Folio' },
    { key: 'typeID', label: 'Tipo' },
    { key: 'company', label: 'Empresa' },
    { key: 'provider', label: 'Proveedor' },
    { key: 'id', label: 'UUID' },
    { key: 'pdf', label: 'PDF' },
    { key: 'xml', label: 'XML' },
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
        <CompanyFilter options={companies} />
        <DateFilter />
      </div>
      <InvoicesTable invoices={invoices} columns={columns} />
    </main>
  );
}
