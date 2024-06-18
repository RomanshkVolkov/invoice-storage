import { getCompanyByID } from '@/app/lib/database/companies';
import Breadcrumbs from '@/app/ui/breadcrumbs';
import EditCompanyForm from '@/app/ui/dashboard/companies/edit-form';
import { notFound } from 'next/navigation';

export default async function Providers({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const company = await getCompanyByID(+id);

  if (!company) {
    notFound();
  }

  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Editar empresa</h1>
        <Breadcrumbs
          items={[
            { label: 'Empresas', href: '/dashboard/companies' },
            { label: 'Editar', href: '#' },
          ]}
        />
      </div>
      <EditCompanyForm company={company} />
    </main>
  );
}
