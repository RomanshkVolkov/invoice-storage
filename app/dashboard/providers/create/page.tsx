import { getProviderUsers } from '@/app/lib/database/user';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateProviderForm from '@/app/ui/dashboard/providers/create-form';

// Pagination and search is handled by the form and not by the server. This is because the selection filter needs the selected users, and that information is handled by a React state, so the server can't retrieve the selected users.
export default async function Page({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) {
  const users = await getProviderUsers();
  const page = searchParams?.page ? +searchParams.page : 1;
  const query = searchParams?.query || '';

  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Crear proveedor</h1>
        <Breadcrumbs
          items={[
            { label: 'Proveedores', href: '/dashboard/providers' },
            { label: 'Crear', href: '#' },
          ]}
        />
      </div>
      <CreateProviderForm users={users} page={page} query={query} />
    </main>
  );
}
