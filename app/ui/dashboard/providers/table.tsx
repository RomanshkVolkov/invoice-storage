'use client';

import { useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Providers } from '@prisma/client';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Button,
} from '@nextui-org/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import EditLinkButton from '../edit-button';
import SearchFilter from '../search-filter';
import Pagination from '../pagination';

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
  totalPages,
}: {
  providers: ProviderItem[];
  totalPages: number;
}) {
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
              <DeleteAction id={provider.id} providerName={provider.name} />
            </div>
          );
        default:
          return provider[columnKey];
      }
    },
    []
  );

  return (
    <Table
      isStriped
      aria-labelledby="providers-table"
      topContent={<SearchFilter data={{ key: 'query', label: 'Buscar' }} />}
      bottomContent={
        <div className="flex justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      }
    >
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
function DeleteAction({
  id,
  providerName,
}: {
  id: number;
  providerName: string;
}) {
  const router = useRouter();
  const handleDelete = () => {
    router.push(`/dashboard/providers/${id}?name=${providerName}`);
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
