'use client';

import { EyeIcon } from '@heroicons/react/24/outline';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Link as LinkComponent,
} from '@nextui-org/react';
import Link from 'next/link';
import React, { Key, useCallback, useMemo } from 'react';
import DeleteButton from '../dashboard/delete-button';
import { useSearchParams } from 'next/navigation';
import PaginationCustom from '../Pagination';
import DownloadFiles from './download-files';
import { normalizeDate } from '@/app/lib/utils';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  typeID: string;
  provider: string;
  dateLoad: Date;
  company: string;
  reference: string;
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
  const search = searchParams.get('query');
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const handleClipboard = async (key: Key) => {
    if (!key) return;
    const ignoreColumns = ['type', 'dateLoad'];
    const [id, column] = key.toString().split('_');
    if (ignoreColumns.includes(column)) return;

    const value = invoices?.find((item) => item.id === id)?.[column] || '';

    if (window.isSecureContext || navigator?.clipboard) {
      await navigator?.clipboard.writeText(value).then(() =>
        toast.success(`Valor copiado al portapapeles: ${value}`, {
          id: `clipboard-${value}`,
        })
      );
    }
  };

  const filteredInvoices = useMemo(() => {
    if (!search) return invoices;
    const items = invoices.filter((invoice) => {
      // eslint-disable-next-line no-unused-vars
      const { _pdf, _xml, ...item } = invoice;
      return Object.values(item).some((value) =>
        Object.values(search.split(' ')).every(
          (search) =>
            String(value).toLowerCase().includes(search.toLowerCase()) ||
            !search
        )
      );
    });

    return items.slice((Number(page || 1) - 1) * 10, Number(page || 1) * 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invoices, page, search]);

  const renderCell = useCallback((invoice: Invoice, columnKey: string) => {
    const cellValue = invoice[columnKey];

    switch (columnKey) {
      case 'pdf':
        return (
          <LinkComponent href={invoice.pdf} target="_blank" as={Link}>
            <EyeIcon className="w-5" />
          </LinkComponent>
        );
      case 'xml':
        return (
          <LinkComponent href={invoice.xml} target="_blank" as={Link}>
            <EyeIcon className="w-5" />
          </LinkComponent>
        );
      case 'dateLoad':
        return normalizeDate(invoice.dateLoad);
      case 'actions':
        return <DeleteButton id={invoice.id} folio={invoice.reference} />;
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table
      isStriped
      aria-labelledby="providers-table"
      selectionMode="multiple"
      selectedKeys={selectedKeys}
      onCellAction={handleClipboard}
      onSelectionChange={setSelectedKeys as any}
      topContent={
        <DownloadFiles
          uuids={invoices.map((item) => item.id)}
          selected={selectedKeys}
        />
      }
      bottomContent={
        <div className="flex w-full justify-center">
          <PaginationCustom limit={10} items={invoices.length} />
        </div>
      }
      classNames={{
        wrapper: 'min-h-[300px]',
      }}
    >
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
              <TableCell key={`${item.id}_${columnKey}`}>
                {renderCell(item, columnKey.toString())}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
