'use client';

import { useCallback, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteCompany } from '@/app/lib/actions/companies.actions';

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
  const searchParams = useSearchParams();

  const filteredProviders = useMemo(() => {
    const query = searchParams.get('query')?.toString();
    if (!query) return companies;

    return companies.filter((provider) =>
      Object.values(provider).some((value) =>
        String(value).toLowerCase().includes(query.toLowerCase())
      )
    );
  }, [companies, searchParams]);

  const renderCell = useCallback(
    (company: Company, columnKey: keyof Company | 'actions') => {
      switch (columnKey) {
        case 'actions':
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="Editar">
                <Button
                  href={`/dashboard/companies/${company.id}/edit`}
                  as={Link}
                  isIconOnly
                >
                  <PencilSquareIcon className="w-5" />
                </Button>
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
      <TableBody items={filteredProviders}>
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
