import { getProviderByID } from '@/app/lib/database/providers';
import { getUserTypes } from '@/app/lib/database/user';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateProviderForm from '@/app/ui/dashboard/create-provider-form';
import EditProviderForm from '@/app/ui/dashboard/edit-provider-form';
import { notFound } from 'next/navigation';

export default async function Providers({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const provider = await getProviderByID(+id);

  if (!provider) {
    notFound();
  }

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
      <EditProviderForm provider={provider} userTypes={userTypes} />
    </main>
  );
}
