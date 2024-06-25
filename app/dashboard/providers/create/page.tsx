import { getUserTypes, getProviderUsers } from '@/app/lib/database/user';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateProviderForm from '@/app/ui/dashboard/providers/create-form';

export default async function Providers() {
  const users = await getProviderUsers();

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
      <CreateProviderForm users={users} />
    </main>
  );
}
