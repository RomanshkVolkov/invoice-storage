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
} from '@nextui-org/react';
import { useCallback } from 'react';

interface Provider {
  id: number;
  rfc: string;
  name: string;
  zipcode: number | null;
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
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar">
              <PencilSquareIcon className="w-6 cursor-pointer text-default-500" />
            </Tooltip>
            <Tooltip color="danger" content="Eliminar">
              <TrashIcon className="w-6 cursor-pointer text-danger" />
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
