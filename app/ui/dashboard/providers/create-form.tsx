'use client';

import { createProvider } from '@/app/lib/actions/providers.actions';
import {
  BuildingStorefrontIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from '@nextui-org/react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { createPagination, hasItems } from '@/app/lib/utils';
import { useState } from 'react';
import SubmitButton from '../submit-button';
import FormLegend from '../../form-legend';
import FormError from '../../form-error';
import FieldsWrapper from '../../fields-wrapper';
import Fields from '../../fields';
import { Users } from '@prisma/client';
import { Errors } from '@/app/lib/schemas/providers.schema';
import Form from '../../form';
import SearchFilter from '../search-filter';
import Pagination from '../pagination';

type User = Pick<Users, 'id' | 'email' | 'name'>;

const columns = [
  {
    key: 'name',
    label: 'NOMBRE',
  },
  {
    key: 'email',
    label: 'CORREO',
  },
];

export default function CreateProviderForm({
  users,
  page,
  query,
}: {
  users: User[];
  page: number;
  query?: string;
}) {
  const initialState = {
    message: '',
    errors: {} as Errors,
  };

  const [selectedUsers, setSelectedUsers] = useState<Set<string> | 'all'>(
    new Set('')
  );
  const [filter, setFilter] = useState<'all' | 'selected' | 'unselected'>(
    'all'
  );

  const createProviderWithUsers = createProvider.bind(
    null,
    selectedUsers === 'all'
      ? users.map((user) => `${user.id}`)
      : Array.from(selectedUsers)
  );
  const [state, dispatch] = useFormState(createProviderWithUsers, initialState);

  const filteredUsers = (
    query
      ? users.filter((user) =>
          Object.values(user).some((value) =>
            String(value).toLowerCase().includes(query.toLowerCase())
          )
        )
      : users
  ).filter((user) => {
    // If user wants to see all users.
    if (filter === 'all') return true;
    // If all users are selected, we don't need to check if the user is selected or not (all users are selected).
    if (selectedUsers === 'all') {
      if (filter === 'selected') return true;
      if (filter === 'unselected') return false;
    }
    // If not all users are selected, we need to check if the user is selected or not.
    if (selectedUsers !== 'all') {
      if (filter === 'selected') return selectedUsers.has(`${user.id}`);
      if (filter === 'unselected') {
        return !selectedUsers.has(`${user.id}`);
      }
    }
    return true;
  });

  const { totalPages, paginatedData } = createPagination(filteredUsers, page);

  return (
    <Form action={dispatch}>
      <fieldset className="mb-8">
        <div className="mb-6">
          <FormLegend icon={BuildingStorefrontIcon}>
            Información del proveedor
          </FormLegend>
        </div>
        <FieldsWrapper>
          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="rfc"
                name="rfc"
                label="RFC"
                maxLength={13}
                formNoValidate
                isInvalid={hasItems(state.errors.rfc)}
                errorMessage={state.errors.rfc?.join(', ')}
              />
            </div>
            <div className="md:w-1/2">
              <Input
                id="zipcode"
                name="zipcode"
                label="Código postal"
                isInvalid={hasItems(state.errors.zipcode)}
                errorMessage={state.errors.zipcode?.join(', ')}
              />
            </div>
          </Fields>
          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="email"
                name="email"
                label="Correo electrónico"
                isInvalid={hasItems(state.errors.name)}
                errorMessage={state.errors.name?.join(', ')}
              />
            </div>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="name"
                name="name"
                label="Nombre"
                isInvalid={hasItems(state.errors.name)}
                errorMessage={state.errors.name?.join(', ')}
              />
            </div>
          </Fields>
        </FieldsWrapper>
      </fieldset>

      <fieldset className="mb-8">
        <div className="mb-6">
          <FormLegend
            icon={UserGroupIcon}
            description="Estos son todos los usuarios disponibles para asignar, únicamente los usuarios seleccionados se asignarán a este proveedor."
          >
            Lista de usuarios
          </FormLegend>
        </div>
        <Table
          aria-label="Lista de usuarios asignables al proveedor"
          selectionMode="multiple"
          color="primary"
          checkboxesProps={{
            name: 'users',
          }}
          onSelectionChange={setSelectedUsers as any}
          topContent={
            <div className="justify-between md:flex">
              <SearchFilter
                data={{
                  key: 'query',
                  label: 'Buscar',
                }}
              />
              <RadioGroup
                label="Filtrar"
                orientation="horizontal"
                onValueChange={setFilter as any}
                value={filter}
              >
                <Radio name="filter" value="all">
                  Todos
                </Radio>
                <Radio name="filter" value="selected">
                  Seleccionados
                </Radio>
                <Radio name="filter" value="unselected">
                  No seleccionados
                </Radio>
              </RadioGroup>
            </div>
          }
          bottomContent={<Pagination totalPages={totalPages} />}
          removeWrapper
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={paginatedData}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </fieldset>

      <FormError>
        {state.message && <p className="w-full text-danger">{state.message}</p>}
        <div className="flex w-full justify-between sm:justify-end">
          <Button
            className="mr-2"
            href="/dashboard/providers"
            variant="flat"
            as={Link}
          >
            Cancelar
          </Button>
          <SubmitButton />
        </div>
      </FormError>
    </Form>
  );
}
