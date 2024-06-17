import CompaniesTable from './table';
import { crudGetCompanies } from '@/app/lib/database/companies';

export default async function TableWrapper() {
  const companies = await crudGetCompanies();

  return <CompaniesTable companies={companies} />;
}
