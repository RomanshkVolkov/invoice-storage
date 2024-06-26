'use client';

import { useFormState } from 'react-dom';
import Link from 'next/link';
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import { Button, Checkbox, Input, Select, SelectItem } from '@nextui-org/react';
import { createNewUser } from '@/app/lib/actions/users.actions';
import { Errors } from '@/app/lib/schemas/users.schema';
import { hasItems } from '@/app/lib/utils';
import SubmitButton from '../submit-button';
import FormLegend from '../../form-legend';
import Form from '../../form';
import FormError from '../../form-error';
import FieldsWrapper from '../../fields-wrapper';
import Fields from '../../fields';
import { useState } from 'react';

export default function EditProviderForm({
  userTypes = [],
}: {
  userTypes: { id: number; name: string }[];
}) {
  const initialState = {
    message: '',
    errors: {} as Errors,
  };

  const [isActive, setIsActive] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const editEntity = createNewUser;
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
                isInvalid={hasItems(state.errors.name)}
                errorMessage={state.errors.name?.join(', ')}
              />
            </div>

            <div className="mb-4 md:mb-0 md:w-1/2">
              <Select
                id="userTypeID"
                name="userTypeID"
                label="Tipo de usuario"
                className="h-full w-full"
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
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="email"
                name="email"
                label="Correo electrónico"
                isInvalid={hasItems(state.errors.email)}
                errorMessage={state.errors.email?.join(', ')}
                description="Con este correo podras recuperar tu contraseña."
              />
            </div>
          </Fields>
        </FieldsWrapper>
      </fieldset>

      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <FormLegend icon={LockClosedIcon}>Credenciales de acceso</FormLegend>
        </div>
        <Fields>
          <div className="mb-4 flex justify-end md:mb-0 md:w-1/2">
            <Input
              id="username"
              name="username"
              label="Usuario"
              isInvalid={hasItems(state.errors.username)}
              errorMessage={state.errors.username?.join(', ')}
            />
          </div>

          <div className="mb-4 flex justify-end md:mb-0 md:w-1/2">
            <Input
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              isInvalid={hasItems(state.errors.password)}
              errorMessage={state.errors.password?.join(', ')}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                >
                  {isVisible ? (
                    <EyeSlashIcon
                      className="pointer-events-none text-2xl text-default-400"
                      width={20}
                    />
                  ) : (
                    <EyeIcon
                      className="pointer-events-none text-2xl text-default-400"
                      width={20}
                    />
                  )}
                </button>
              }
            />
          </div>
        </Fields>
        <Fields>
          <div className="mt-4 flex w-full justify-end">
            <label htmlFor="isActive">
              <span className="mr-2">Usuario activo</span>
              <Checkbox
                id="isActive"
                name="isActive"
                defaultSelected={isActive}
                value={String(isActive)}
                onValueChange={(value) => setIsActive(value)}
              />
            </label>
          </div>
        </Fields>
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
