'use client';

import { ArrowDownCircleIcon, EyeIcon } from '@heroicons/react/24/outline';
import {
  Button,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import Link from 'next/link';
import { Link as LinkComponent } from '@nextui-org/react';
import React, { useCallback, useMemo } from 'react';
import DeleteButton from '../dashboard/delete-button';
import { useSearchParams } from 'next/navigation';
import PaginationCustom from '../Pagination';
import DownloadFiles from './download-files';

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
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

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
      case 'actions':
        return <DeleteButton id={invoice.id} />;
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
      classNames={{ wrapper: 'min-h-[300px]' }}
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
              <TableCell>{renderCell(item, columnKey.toString())}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
