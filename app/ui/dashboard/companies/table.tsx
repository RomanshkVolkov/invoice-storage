'use client';

import { useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import { Companies } from '@prisma/client';
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
import { TrashIcon } from '@heroicons/react/24/outline';
import EditLinkButton from '../edit-button';
import { useRouter } from 'next/navigation';
import SearchFilter from '../search-filter';
import Pagination from '../pagination';

const columns = [
  { key: 'name', label: 'NOMBRE' },
  { key: 'rfc', label: 'RFC' },
  { key: 'prefix', label: 'ALIAS' },
  { key: 'actions', label: 'ACCIONES' },
];

type Company = Omit<Companies, 'isDeleted' | 'emails'>;

export default function CompaniesTable({
  companies,
  totalPages,
}: {
  companies: Company[];
  totalPages: number;
}) {
  const renderCell = useCallback(
    (company: Company, columnKey: keyof Company | 'actions') => {
      switch (columnKey) {
        case 'actions':
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="Editar">
                <EditLinkButton
                  href={`/dashboard/companies/${company.id}/edit`}
                />
              </Tooltip>
              <DeleteAction
                id={company.id}
                companyName={company.name}
                isDeletable={company.isDeletable}
              />
            </div>
          );
        default:
          return company[columnKey];
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
      <TableBody items={companies}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey.toString() as keyof Company)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

function DeleteAction({
  id,
  companyName,
  isDeletable,
}: {
  id: number;
  companyName: string;
  isDeletable: boolean;
}) {
  const router = useRouter();
  const handleDelete = () => {
    router.push(`/dashboard/delete-company/${id}?name=${companyName}`);
  };

  return (
    <form action={handleDelete}>
      <DeleteButton isDeletable={isDeletable} />
    </form>
  );
}

function DeleteButton({ isDeletable }: { isDeletable: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Tooltip content="Eliminar" color="danger">
      <Button
        color={isDeletable ? 'danger' : 'default'}
        type="submit"
        isLoading={pending}
        isDisabled={!isDeletable}
        isIconOnly
      >
        <TrashIcon className="w-5" />
      </Button>
    </Tooltip>
  );
}
