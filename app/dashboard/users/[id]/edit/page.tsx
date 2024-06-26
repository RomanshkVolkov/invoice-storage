import { getUserTypes, getUserByID } from '@/app/lib/database/user';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import EditUserForm from '@/app/ui/dashboard/users/edit-form';
import { notFound } from 'next/navigation';

export default async function Providers({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const user = await getUserByID(+id);
  const userTypes = await getUserTypes();

  if (!user) {
    notFound();
  }

  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Editar usuario</h1>
        <Breadcrumbs
          items={[
            { label: 'Usuarios', href: '/dashboard/users' },
            { label: 'Editar', href: '#' },
          ]}
        />
      </div>
      <EditUserForm user={user} userTypes={userTypes} />
    </main>
  );
}
