import { getUserTypes } from '@/app/lib/database/user';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateUserForm from '@/app/ui/dashboard/users/create-form';

export default async function Providers() {
  const userTypes = await getUserTypes();

  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Editar proveedor</h1>
        <Breadcrumbs
          items={[
            { label: 'Usuarios', href: '/dashboard/users' },
            { label: 'Crear', href: '#' },
          ]}
        />
      </div>
      <CreateUserForm userTypes={userTypes} />
    </main>
  );
}
