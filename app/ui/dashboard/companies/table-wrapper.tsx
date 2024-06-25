import React from 'react';

import { crudGetCompanies } from '@/app/lib/database/companies';
import CompaniesTable from './table';

export default async function TableWrapper({ query }: { query?: string }) {
  const companies = await crudGetCompanies();

  const filteredCompanies = !query
    ? companies
    : companies.filter((company) =>
        Object.values(company).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      );

  return <CompaniesTable companies={filteredCompanies} />;
}
