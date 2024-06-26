import DeleleteModal from '@/app/ui/dashboard/delete-modal';
import { deleteProvider } from '@/app/lib/actions/providers.actions';
import { getProviderByID } from '@/app/lib/database/providers';

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { name?: string };
}) {
  const provider = await getProviderByID(+id);
  if (!provider) return null;
  return (
    <DeleleteModal
      id={+id}
      title={`Eliminar a ${searchParams?.name}`}
      deleteAction={deleteProvider}
      showDelete={provider.invoices.length === 0}
    >
      {provider.invoices.length > 0 && (
        <p>
          No puedes eliminar este proveedor porque tiene facturas asociadas.
        </p>
      )}
      {provider.invoices.length === 0 && (
        <p>¿Estás seguro que deseas eliminar este proveedor?</p>
      )}
    </DeleleteModal>
  );
}
