import { getInvoices } from '@/app/lib/database/invoice';
import InvoicesTable from '@/app/ui/dashboard/invoices-table';

export default async function page() {
  const invoices = await getInvoices();
  const columns = [
    { key: 'uuid', label: 'UUID' },
    { key: 'company', label: 'Empresa' },
    { key: 'provider', label: 'Proveedor' },
    { key: 'files', label: 'Archivos' },
  ];
  // ["UUID", "Empresa", "Proveedor", "files"];
  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Facturas</h1>
      </div>
      <InvoicesTable invoices={invoices} columns={columns} />
    </main>
  );
}
