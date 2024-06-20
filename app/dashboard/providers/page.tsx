import { auth } from '@/auth';
import { getProviders } from '@/app/lib/database/providers';
import SearchFilter from '@/app/ui/dashboard/search-filter';
import ProvidersTable from '@/app/ui/dashboard/providers/table';
import CreateLinkButton from '@/app/ui/dashboard/create-button';

export default async function Page() {
  const session = await auth();
  const userID = +(session?.user?.id || 0);
  const providers = await getProviders(userID);

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
      <ProvidersTable providers={providers} />
    </main>
  );
}
