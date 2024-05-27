'use client';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
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
import Link from 'next/link';
import { useCallback } from 'react';

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
}: {
  providers: Provider[];
  columns: { key: string; label: string }[];
}) {
  const renderCell = useCallback((provider: Provider, columnKey: string) => {
    const cellValue = provider[columnKey];

    switch (columnKey) {
      case 'name':
        return cellValue;
      case 'role':
        return cellValue;
      case 'status':
        return cellValue;
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
            <Tooltip color="danger" content="Eliminar">
              <Button color="danger" isIconOnly>
                <TrashIcon className="w-5" />
              </Button>
            </Tooltip>
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
