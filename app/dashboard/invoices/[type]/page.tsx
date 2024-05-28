import { blob } from '@/app/lib/blob/autentication';
import CustomBreadcrumbs from '@/app/ui/breadcrumbs';

const getFile = async (path: string) => {
  return `${process.env.AZURE_BLOB_PATH}${path}`;
};

export default async function page({
  params: { type },
  searchParams: { path },
}: {
  params: { type: string };
  searchParams: { path: string };
}) {
  const file = await getFile(path);
  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Factura {type}</h1>
        <CustomBreadcrumbs
          items={[
            { label: 'Facturas', href: '/dashboard/invoices' },
            { label: `Factura ${type}`, href: '#' },
          ]}
        />
      </div>
      <iframe src={file} className="h-screen w-full" />
    </main>
  );
}
