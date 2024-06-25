'use client';
import { deleteUser } from '@/app/lib/actions/users.actions';
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
import { Users } from '@prisma/client';

const columns = [
  { key: 'name', label: 'NOMBRE' },
  { key: 'username', label: 'Usuario' },
  { key: 'email', label: 'EMAIL' },
  { key: 'type', label: 'TIPO' },
  { key: 'actions', label: 'ACCIONES' },
];

type UserItem = Omit<
  Users,
  'isActive' | 'userTypeID' | 'password' | 'otp' | 'otpExpireDate' | 'isDeleted'
> & {
  [key: string]: any;
};

export default function ProvidersTable({ users }: { users: UserItem[] }) {
  const searchParams = useSearchParams();

  const filteredProviders = useMemo(() => {
    const query = searchParams.get('query')?.toString();
    if (!query) return users;

    return users.filter((user) =>
      Object.values(user).some((value) =>
        Object.values(query.split(' ')).every(
          (search) =>
            String(value).toLowerCase().includes(search.toLowerCase()) ||
            !search
        )
      )
    );
  }, [users, searchParams]);

  const renderCell = useCallback(
    (user: UserItem, columnKey: keyof UserItem) => {
      switch (columnKey) {
        case 'type':
          return user.type.name;
        case 'actions':
          return (
            <div className="relative flex items-center justify-center gap-2">
              <Tooltip content="Editar">
                <EditLinkButton href={`/dashboard/users/${user.id}/edit`} />
              </Tooltip>
              <DeleteAction id={user.id} />
            </div>
          );
        default:
          return user[columnKey];
      }
    },
    []
  );

  return (
    <Table
      isStriped
      aria-labelledby="users-table"
      isHeaderSticky
      classNames={{
        base: 'max-h-[80vh] overflow-scroll',
      }}
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
    const state = await deleteUser(id);
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
