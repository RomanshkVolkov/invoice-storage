import DeleleteModal from '@/app/ui/dashboard/delete-modal';
import { deleteCompany } from '@/app/lib/actions/companies.actions';

export default function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { name?: string };
}) {
  return (
    <DeleleteModal
      title={`Eliminar a ${searchParams?.name}`}
      deleteAction={async () => {
        'use server';
        return await deleteCompany(+id);
      }}
    >
      <p>¿Estás seguro que deseas eliminar esta empresa?</p>
    </DeleleteModal>
  );
}
