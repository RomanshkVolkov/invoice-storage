import { getUserTypes } from '@/app/lib/database/user';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateProviderForm from '@/app/ui/dashboard/create-provider-form';

export default async function Providers({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const userTypes = await getUserTypes();

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
      <CreateProviderForm userTypes={userTypes} />
    </main>
  );
}
