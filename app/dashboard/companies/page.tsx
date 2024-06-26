import CreateLinkButton from '@/app/ui/dashboard/create-button';
import TableWrapper from '@/app/ui/dashboard/companies/table-wrapper';

// eslint-disable-next-line require-await
export default async function Companies({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const page = searchParams?.page ? +searchParams.page : 1;

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl">Empresas</h1>
        <CreateLinkButton href="/dashboard/companies/create">
          Crear empresa
        </CreateLinkButton>
      </div>
      <TableWrapper query={searchParams?.query} page={page} />
    </main>
  );
}
