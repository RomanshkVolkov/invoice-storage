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
  [key: string]: any;
}

export default function ProvidersTable({
  providers,
  columns,
  currentProviderID,
}: {
  providers: Provider[];
  columns: { key: string; label: string }[];
  currentProviderID: number;
}) {
  const renderCell = useCallback((provider: Provider, columnKey: string) => {
    const cellValue = provider[columnKey];

    switch (columnKey) {
      case 'actions':
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Button
              href={`/dashboard/providers/${provider.id}/edit`}
              as={Link}
              isIconOnly
            >
              <PencilSquareIcon className="w-5" />
            </Button>
            <DeleteAction
              id={provider.id}
              canDelete={provider.id !== currentProviderID}
            />
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

function DeleteAction({ id, canDelete }: { id: number; canDelete: boolean }) {
  const handleDelete = async () => {
    const state = await deleteProvider(id);
    if (state?.message) {
      toast.error(state.message);
    }
  };

  return (
    <form action={handleDelete}>
      <DeleteButton canDelete={canDelete} />
    </form>
  );
}

function DeleteButton({ canDelete }: { canDelete: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      color="danger"
      type="submit"
      isLoading={pending}
      isDisabled={!canDelete}
      isIconOnly
    >
      <TrashIcon className="w-5" />
    </Button>
  );
}
