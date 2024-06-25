import SearchFilter from '@/app/ui/dashboard/search-filter';
import CreateLinkButton from '@/app/ui/dashboard/create-button';
import TableWrapper from '@/app/ui/dashboard/providers/table-wrapper';

// eslint-disable-next-line require-await
export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl">Proveedores</h1>
        <CreateLinkButton href="/dashboard/providers/create">
          Crear proveedor
        </CreateLinkButton>
      </div>
      <div className="mb-4">
        <SearchFilter data={{ key: 'query', label: 'Buscar' }} />
      </div>
      <TableWrapper query={searchParams?.query} />
    </main>
  );
}
