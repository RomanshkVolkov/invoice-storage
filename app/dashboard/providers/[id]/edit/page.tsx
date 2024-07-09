import { getProviderByID } from '@/app/lib/database/providers';
import { getProviderUsers } from '@/app/lib/database/user';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import EditProviderForm from '@/app/ui/dashboard/providers/edit-form';
import { notFound } from 'next/navigation';

export default async function Providers({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { query?: string; page?: string };
}) {
  const provider = await getProviderByID(+id);

  if (!provider) {
    notFound();
  }

  const users = await getProviderUsers();
  const page = searchParams?.page ? +searchParams.page : 1;
  const query = searchParams?.query || '';

  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Editar proveedor</h1>
        <Breadcrumbs
          items={[
            { label: 'Proveedores', href: '/dashboard/providers' },
            { label: 'Editar', href: '#' },
          ]}
        />
      </div>
      <EditProviderForm
        provider={provider}
        users={users}
        page={page}
        query={query}
      />
    </main>
  );
}
