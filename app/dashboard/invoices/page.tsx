import { getInvoicesByDateRange } from '@/app/lib/actions/invoices.actions';
import DateFilter from '@/app/ui/dashboard/date-filter';
import InvoicesTable from '@/app/ui/invoices/table';
import SearchFilter from '@/app/ui/dashboard/search-filter';
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import CompanyFilter from '@/app/ui/dashboard/providers/company-filter';
import { getCompanies } from '@/app/lib/database/companies';
import { auth } from '@/auth';
import CreateLinkButton from '@/app/ui/dashboard/create-button';

export default async function page({
  searchParams: { startDate, endDate, company, query },
}: {
  searchParams: {
    startDate: string;
    endDate: string;
    company: string;
    query: string;
  };
}) {
  const session = await auth();
  const isSearch = !!query;
  const invoices = await getInvoicesByDateRange({
    startDate: isSearch ? null : startDate,
    endDate: isSearch ? null : endDate,
    company:
      session?.user?.type.id === 1 && company !== 'null' ? company : null,
    isSearch,
  });

  const companies = await getCompanies(); // This is a call to the database

  const columns = [
    { key: 'reference', label: 'Folio' },
    { key: 'typeID', label: 'Tipo' },
    { key: 'dateLoad', label: 'Fecha de carga' },
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
        <CreateLinkButton
          href="/dashboard/invoices/create"
          icon={CloudArrowUpIcon}
        >
          Cargar factura
        </CreateLinkButton>
      </div>
      <div className="mb-4 flex flex-col justify-between gap-2 rounded-large md:flex-row">
        <SearchFilter data={{ key: 'query', label: 'Buscar' }} />
        {session?.user?.type.id === 1 && (
          <CompanyFilter
            options={[{ label: 'Ver todos', value: null }].concat(
              companies as any[]
            )}
          />
        )}
        <DateFilter />
      </div>
      <InvoicesTable invoices={invoices} columns={columns} />
    </main>
  );
}
