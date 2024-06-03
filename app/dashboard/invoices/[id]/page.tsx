import { getInvoiceById } from '@/app/lib/actions/invoice.actions';
import CustomBreadcrumbs from '@/app/ui/breadcrumbs';
import FrameViewer from '@/app/ui/frame-viewer';
import TabFiles from '@/app/ui/invoices/tab-files';

const getInvoice = async (id: string) => {
  return await getInvoiceById(id);
};

export default async function page({
  params: { id },
}: {
  params: { id: string };
}) {
  const file = await getInvoice(id);
  return (
    <main>
      <div className="mb-6 flex flex-col">
        <h1 className="mb-4 text-4xl">Factura</h1>
        <CustomBreadcrumbs
          items={[
            { label: 'Facturas', href: '/dashboard/invoices' },
            { label: 'Factura', href: '#' },
          ]}
        />
      </div>
      <TabFiles pdf={file?.pdf} xml={file?.xml} />
    </main>
  );
}
