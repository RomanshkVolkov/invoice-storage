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
      id={+id}
      title={`Eliminar a ${searchParams?.name}`}
      deleteAction={deleteUser}
    >
      <p>¿Estás seguro que deseas eliminar este usuario?</p>
    </DeleleteModal>
  );
}
