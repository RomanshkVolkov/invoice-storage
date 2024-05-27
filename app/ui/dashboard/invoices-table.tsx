'use client';
import { EyeIcon, TrashIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import Link from 'next/link';
import { useCallback } from 'react';
import DeleteButton from './delete-button';

interface Invoice {
  id: string;
  provider: string;
  company: string;
  pdf: string;
  xml: string;
  [key: string]: any;
}

export default function InvoicesTable({
  invoices,
  columns,
}: {
  invoices: Invoice[];
  columns: { key: string; label: string }[];
}) {
  const renderCell = useCallback((invoice: Invoice, columnKey: string) => {
    const cellValue = invoice[columnKey];

    switch (columnKey) {
      case 'pdf':
        return (
          <Tooltip content="Ver PDF">
            <Button
              href={`/dashboard/invoices/pdf?path=${invoice.pdf}`}
              as={Link}
              isIconOnly
            >
              <EyeIcon className="w-5" />
            </Button>
          </Tooltip>
        );
      case 'xml':
        return (
          <Tooltip content="Ver XML">
            <Button
              href={`/dashboard/invoices/xml?path=${invoice.xml}`}
              as={Link}
              isIconOnly
            >
              <EyeIcon className="w-5" />
            </Button>
          </Tooltip>
        );
      case 'actions':
        return <DeleteButton id={invoice.id} />;
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
      <TableBody items={invoices}>
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
