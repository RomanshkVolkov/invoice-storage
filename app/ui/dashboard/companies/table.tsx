'use client';

import { useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import { Companies } from '@prisma/client';
import { toast } from 'sonner';
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
import { deleteCompany } from '@/app/lib/actions/companies.actions';
import EditLinkButton from '../edit-button';

const columns = [
  { key: 'name', label: 'NOMBRE' },
  { key: 'rfc', label: 'RFC' },
  { key: 'prefix', label: 'ALIAS' },
  { key: 'actions', label: 'ACCIONES' },
];

type Company = Omit<Companies, 'isDeleted' | 'emails'>;

export default function CompaniesTable({
  companies,
}: {
  companies: Company[];
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
              <DeleteAction id={company.id} isDeletable={company.isDeletable} />
            </div>
          );
        default:
          return company[columnKey];
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
  isDeletable,
}: {
  id: number;
  isDeletable: boolean;
}) {
  const handleDelete = async () => {
    if (!isDeletable) return;
    const state = await deleteCompany(id);
    if (state?.message) {
      toast.error(state.message);
    }
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
