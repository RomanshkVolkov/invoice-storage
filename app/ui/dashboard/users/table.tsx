'use client';

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
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useMemo } from 'react';
import { createPagination } from '@/app/lib/utils';
import { useFormStatus } from 'react-dom';
import EditLinkButton from '../edit-button';
import { Users } from '@prisma/client';
import SearchFilter from '../search-filter';
import Pagination from '../pagination';

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

export default function UsersTable({ users }: { users: UserItem[] }) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page')?.toString() || 1;
  const query = searchParams.get('query')?.toString();

  const filteredUsers = useMemo(() => {
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
  }, [users, query]);

  const { totalPages, paginatedData } = createPagination(filteredUsers, +page);

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
              <DeleteAction id={user.id} username={user.username} />
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
      <TableBody items={paginatedData}>
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

function DeleteAction({ id, username }: { id: number; username: string }) {
  const router = useRouter();
  const handleDelete = () => {
    router.push(`/dashboard/users/${id}?name=${username}`);
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
