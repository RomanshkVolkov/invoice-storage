import React from 'react';

import { crudGetCompanies } from '@/app/lib/database/companies';
import { createPagination } from '@/app/lib/utils';
import CompaniesTable from './table';

export default async function TableWrapper({
  query,
  page,
}: {
  query?: string;
  page: number;
}) {
  const companies = await crudGetCompanies();

  const filteredCompanies = !query
    ? companies
    : companies.filter((company) =>
        Object.values(company).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      );

  const { totalPages, paginatedData } = createPagination(
    filteredCompanies,
    page
  );

  return <CompaniesTable companies={paginatedData} totalPages={totalPages} />;
}
