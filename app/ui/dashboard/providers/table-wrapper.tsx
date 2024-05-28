import { getProviders } from '@/app/lib/database/providers';
import { auth } from '@/auth';
import ProvidersTable from './table';

export default async function TableWrapper() {
  const session = await auth();
  const providers = await getProviders(+(session?.user?.id || 0));

  return <ProvidersTable providers={providers} />;
}
