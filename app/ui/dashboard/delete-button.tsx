'use client';

import { TrashIcon } from '@heroicons/react/24/outline';
import { Button, Tooltip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function DeleteButton({
  id,
  folio,
}: {
  id: string;
  folio: string;
}) {
  const router = useRouter();

  const handleDelete = (id: string) => {
    router.push(`/dashboard/delete-invoice/${id}?folio=${folio}`);
  };

  return (
    <Tooltip color="danger" content="Eliminar">
      <Button color="danger" isIconOnly onClick={() => handleDelete(id)}>
        <TrashIcon className="w-5" />
      </Button>
    </Tooltip>
  );
}
