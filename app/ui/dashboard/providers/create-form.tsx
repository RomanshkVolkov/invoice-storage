'use client';

import { createProvider } from '@/app/lib/actions/providers.actions';
import {
  BuildingStorefrontIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import {
  Button,
  Input,
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
import { hasItems } from '@/app/lib/utils';
import { useState } from 'react';
import SubmitButton from '../submit-button';
import FormLegend from '../../form-legend';
import FormError from '../../form-error';
import FieldsWrapper from '../../fields-wrapper';
import Fields from '../../fields';
import { Users } from '@prisma/client';
import { Errors } from '@/app/lib/schemas/providers.schema';
import Form from '../../form';

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

export default function CreateProviderForm({ users }: { users: User[] }) {
  const initialState = {
    message: '',
    errors: {} as Errors,
  };

  const [selectedUsers, setSelectedUsers] = useState<Set<string> | 'all'>(
    new Set('')
  );

  const createProviderWithUsers = createProvider.bind(
    null,
    selectedUsers === 'all'
      ? users.map((user) => `${user.id}`)
      : Array.from(selectedUsers)
  );
  const [state, dispatch] = useFormState(createProviderWithUsers, initialState);

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
          removeWrapper
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={users}>
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
