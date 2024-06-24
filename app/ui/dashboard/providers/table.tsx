'use client';
import { deleteProvider } from '@/app/lib/actions/providers.actions';
import { Provider, User } from '@/app/lib/types';
import { TrashIcon } from '@heroicons/react/24/outline';
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
import { useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import EditLinkButton from '../edit-button';
import { Providers } from '@prisma/client';

const columns = [
  { key: 'rfc', label: 'RFC' },
  { key: 'name', label: 'NOMBRE' },
  { key: 'zipcode', label: 'CÓDIGO POSTAL' },
  { key: 'email', label: 'EMAIL' },
  { key: 'actions', label: 'ACCIONES' },
];

type ProviderItem = Omit<Providers, 'isDeleted'> & {
  [key: string]: any;
};

export default function ProvidersTable({
  providers,
}: {
  providers: ProviderItem[];
}) {
  const searchParams = useSearchParams();

  const filteredProviders = useMemo(() => {
    const query = searchParams.get('query')?.toString();
    if (!query) return providers;

    return providers.filter((provider) =>
      Object.values(provider).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [providers, searchParams]);

  const renderCell = useCallback(
    (provider: ProviderItem, columnKey: keyof ProviderItem) => {
      switch (columnKey) {
        case 'actions':
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="Editar">
                <EditLinkButton
                  href={`/dashboard/providers/${provider.id}/edit`}
                />
              </Tooltip>
              <DeleteAction id={provider.id} />
            </div>
          );
        default:
          return provider[columnKey];
      }
    },
    []
  );

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
      <TableBody items={filteredProviders}>
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
    <Tooltip content="Eliminar" color="danger">
      <Button color="danger" type="submit" isLoading={pending} isIconOnly>
        <TrashIcon className="w-5" />
      </Button>
    </Tooltip>
  );
}
