'use client';
import { deleteProvider } from '@/app/lib/actions/providers.actions';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Tooltip,
} from '@nextui-org/react';
import Link from 'next/link';
import { useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

interface Provider {
  id: number;
  rfc: string;
  name: string;
  zipcode: number | null;
  email: string;
  user: {
    id: number;
  };
  [key: string]: any;
}

export default function ProvidersTable({
  providers,
  columns,
}: {
  providers: Provider[];
  columns: { key: string; label: string }[];
}) {
  const renderCell = useCallback((provider: Provider, columnKey: string) => {
    const cellValue = provider[columnKey];

    switch (columnKey) {
      case 'actions':
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Tooltip content="Editar">
              <Button
                href={`/dashboard/providers/${provider.id}/edit`}
                as={Link}
                isIconOnly
              >
                <PencilSquareIcon className="w-5" />
              </Button>
            </Tooltip>
            <DeleteAction id={provider.id} />
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table isStriped aria-labelledby="providers-table">
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === 'actions' ? 'center' : 'start'}
            className={column.key === 'actions' ? 'text-center' : ''}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={providers}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey.toString())}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function DeleteAction({ id }: { id: number }) {
  const handleDelete = async () => {
    const state = await deleteProvider(id);
    if (state?.message) {
      toast.error(state.message);
    }
  };

  return (
    <form action={handleDelete}>
      <DeleteButton />
    </form>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Tooltip content="Eliminar">
      <Button color="danger" type="submit" isLoading={pending} isIconOnly>
        <TrashIcon className="w-5" />
      </Button>
    </Tooltip>
  );
}
