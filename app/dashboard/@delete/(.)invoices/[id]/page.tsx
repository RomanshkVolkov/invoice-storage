import DeleleteModal from '@/app/ui/dashboard/delete-modal';
import { deleteInvoice } from '@/app/lib/actions/invoices.actions';

export default function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { folio?: string };
}) {
  return (
    <DeleleteModal
      title={`Eliminar factura ${searchParams?.folio}`}
      deleteAction={async () => {
        'use server';
        return await deleteInvoice(id);
      }}
    >
      <p>¿Estás seguro que deseas eliminar esta factura?</p>
    </DeleleteModal>
  );
}
