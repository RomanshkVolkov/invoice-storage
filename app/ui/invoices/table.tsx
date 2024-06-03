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
import { useCallback, useMemo } from 'react';
import DeleteButton from '../dashboard/delete-button';
import { useRouter, useSearchParams } from 'next/navigation';

interface Invoice {
  id: string;
  typeID: string;
  provider: string;
  company: string;
  [key: string]: any;
}

export default function InvoicesTable({
  invoices,
  columns,
}: {
  invoices: Invoice[];
  columns: { key: string; label: string }[];
}) {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');
  const search = searchParams.get('invoice-search');
  const { replace } = useRouter();

  const filteredInvoices = useMemo(() => {
    if (!search) return invoices;
    const items = invoices.filter((invoice) =>
      Object.values(invoice).some((value) =>
        Object.values(search.split(' ')).every(
          (search) =>
            String(value).toLowerCase().includes(search.toLowerCase()) ||
            !search
        )
      )
    );

    const params = new URLSearchParams(searchParams);
    params.set('items', String(items.length));
    console.log('items', items.length);
    replace(`?${params.toString()}`);

    return items.slice((Number(page || 1) - 1) * 10, Number(page || 1) * 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices, page, search]);

  const renderCell = useCallback((invoice: Invoice, columnKey: string) => {
    const cellValue = invoice[columnKey];

    switch (columnKey) {
      case 'files':
        return (
          <Tooltip content="Ver archivos">
            <Button
              href={`/dashboard/invoices/${invoice.id}`}
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
      <TableBody
        items={filteredInvoices}
        emptyContent="No hay facturas disponibles."
      >
        {(item) => (
          <TableRow key={`${item.id}`}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey.toString())}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
