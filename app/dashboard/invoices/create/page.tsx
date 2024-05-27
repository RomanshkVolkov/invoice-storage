import CustomBreadcrumbs from '@/app/ui/breadcrumbs';
import UploadCard from '@/app/ui/upload-invoice/upload-card';

export default function page() {
  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Cargar factura</h1>
        <CustomBreadcrumbs
          items={[
            { label: 'Facturas', href: '/dashboard/invoices' },
            { label: 'Crear', href: '#' },
          ]}
        />
      </div>
      <UploadCard />
    </main>
  );
}
