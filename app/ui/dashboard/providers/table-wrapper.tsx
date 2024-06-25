import React from 'react';

import { getProviders } from '@/app/lib/database/providers';
import ProvidersTable from './table';

export default async function TableWrapper({ query }: { query?: string }) {
  const providers = await getProviders();

  const filteredProviders = !query
    ? providers
    : providers.filter((provider) =>
        Object.values(provider).some((value) =>
          String(value).toLowerCase().includes(query.toLowerCase())
        )
      );

  return <ProvidersTable providers={filteredProviders} />;
}
