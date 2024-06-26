import DeleleteModal from '@/app/ui/dashboard/delete-modal';
import { deleteUser } from '@/app/lib/actions/users.actions';

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
        return await deleteUser(+id);
      }}
    >
      <p>¿Estás seguro que deseas eliminar este usuario?</p>
    </DeleleteModal>
  );
}
