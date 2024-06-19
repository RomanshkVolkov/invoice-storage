import Breadcrumbs from '@/app/ui/breadcrumbs';
import CreateCompanyForm from '@/app/ui/dashboard/companies/create-form';

export default function Providers() {
  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Crear empresa</h1>
        <Breadcrumbs
          items={[
            { label: 'Proveedores', href: '/dashboard/companies' },
            { label: 'Crear', href: '#' },
          ]}
        />
      </div>
      <CreateCompanyForm />
    </main>
  );
}
