import React from 'react';

import { getProviders } from '@/app/lib/database/providers';
import { createPagination } from '@/app/lib/utils';
import ProvidersTable from './table';

export default async function TableWrapper({
  query,
  page,
}: {
  query?: string;
  page: number;
}) {
  const providers = await getProviders();

  const filteredProviders = query
    ? providers.filter((provider) =>
        Object.values(provider).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      )
    : providers;

  const { totalPages, paginatedData } = createPagination(
    filteredProviders,
    page
  );

  return <ProvidersTable providers={paginatedData} totalPages={totalPages} />;
}
