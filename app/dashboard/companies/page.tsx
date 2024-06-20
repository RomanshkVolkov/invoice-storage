import { crudGetCompanies } from '@/app/lib/database/companies';
import SearchFilter from '@/app/ui/dashboard/search-filter';
import CreateLinkButton from '@/app/ui/dashboard/create-button';
import CompaniesTable from '@/app/ui/dashboard/companies/table';

export default async function Companies() {
  const companies = await crudGetCompanies();

  return (
    <main>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-4xl">Empresas</h1>
        <CreateLinkButton href="/dashboard/companies/create">
          Crear empresa
        </CreateLinkButton>
      </div>
      <div className="mb-4">
        <SearchFilter data={{ key: 'query', label: 'Buscar' }} />
      </div>
      <CompaniesTable companies={companies} />
    </main>
  );
}
