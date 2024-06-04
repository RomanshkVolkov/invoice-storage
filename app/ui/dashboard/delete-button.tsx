'use client';

import { deleteInvoice } from '@/app/lib/actions/invoice.actions';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button, Tooltip } from '@nextui-org/react';
import { useTransition } from 'react';
import { toast } from 'sonner';

export default function DeleteButton({ id }: { id: string }) {
  const [ispending, startTransition] = useTransition();

  const handleDelete = (id: string) => {
    startTransition(() => {
      deleteInvoice(id)
        .then(() => {
          toast.success('Factura eliminada correctamente');
        })
        .catch((e) => {
          toast.error(e.message);
        });
    });
  };

  return (
    <Tooltip color="danger" content="Eliminar">
      <Button
        color="danger"
        isIconOnly
        onClick={() => handleDelete(id)}
        isLoading={ispending}
      >
        <TrashIcon className="w-5" />
      </Button>
    </Tooltip>
  );
}
