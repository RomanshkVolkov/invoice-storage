'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import { Users } from '@prisma/client';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { Button, Checkbox, Input, Select, SelectItem } from '@nextui-org/react';
import { editUserByID } from '@/app/lib/actions/users.actions';
import { Errors } from '@/app/lib/schemas/users.schema';
import { hasItems } from '@/app/lib/utils';
import SubmitButton from '../submit-button';
import FormLegend from '../../form-legend';
import Form from '../../form';
import FormError from '../../form-error';
import FieldsWrapper from '../../fields-wrapper';
import Fields from '../../fields';
import { useState } from 'react';

type User = Pick<Users, 'id' | 'email' | 'name' | 'username' | 'isActive'> & {
  type: { id: number; name: string };
};

export default function EditProviderForm({
  user,
  userTypes = [],
}: {
  user: User;
  userTypes: { id: number; name: string }[];
}) {
  const initialState = {
    message: '',
    errors: {} as Errors,
  };

  const [isActive, setIsActive] = useState(user.isActive);

  const spacer = <div className="mb-4 md:mb-0 md:w-1/2" />;

  const editEntity = editUserByID.bind(null, user.id);
  const [state, dispatch] = useFormState(editEntity, initialState);

  return (
    <Form action={dispatch}>
      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <FormLegend icon={UserGroupIcon}>Información del usuario</FormLegend>
        </div>
        <FieldsWrapper>
          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="name"
                name="name"
                label="Nombre"
                isInvalid={hasItems(state.errors?.name)}
                errorMessage={state.errors?.name?.join(', ')}
                defaultValue={user.name}
              />
            </div>
            <div className="md:w-1/2">
              <Input
                id="username"
                name="username"
                label="Usuario"
                isInvalid={hasItems(state.errors.username)}
                errorMessage={state.errors.username?.join(', ')}
                defaultValue={String(user.username) || ''}
              />
            </div>
          </Fields>
          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="email"
                name="email"
                label="Correo electrónico"
                isInvalid={hasItems(state.errors.email)}
                errorMessage={state.errors.email?.join(', ')}
                defaultValue={user.email}
              />
            </div>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Select
                id="userTypeID"
                name="userTypeID"
                label="Tipo de usuario"
                className="h-full w-full"
                defaultSelectedKeys={new Set([String(user.type.id)])}
              >
                {userTypes.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </Fields>
          <Fields>
            {spacer}
            <div className="mb-4 flex justify-end md:mb-0 md:w-1/2">
              <label htmlFor="isActive">
                <span className="mr-2">Usuario activo</span>
                <Checkbox
                  id="isActive"
                  name="isActive"
                  defaultValue={user.isActive ? 1 : 0}
                  defaultSelected={user.isActive || false}
                  value={String(isActive)}
                  onValueChange={(value) => setIsActive(value)}
                />
              </label>
            </div>
          </Fields>
        </FieldsWrapper>
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
