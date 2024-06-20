'use client';

import { createProvider } from '@/app/lib/actions/providers.actions';
import {
  EyeIcon,
  EyeSlashIcon,
  IdentificationIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { hasItems } from '@/app/lib/utils';
import { useState } from 'react';
import SubmitButton from '../submit-button';
import FormLegend from '../../form-legend';
import FormError from '../../form-error';
import FieldsWrapper from '../../fields-wrapper';
import Fields from '../../fields';

interface UserType {
  id: number;
  name: string;
}

interface Errors {
  rfc?: string[] | undefined;
  name?: string[] | undefined;
  zipcode?: string[] | undefined;
  type?: string[] | undefined;
  email?: string[] | undefined;
  password?: string[] | undefined;
}

export default function CreateProviderForm({
  userTypes,
}: {
  userTypes: UserType[];
}) {
  const initialState = {
    message: '',
    errors: {} as Errors,
  };
  const [state, dispatch] = useFormState(createProvider, initialState);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form
      aria-describedby="form-error"
      className="rounded-xl border bg-white p-6 shadow-xl  dark:border-none dark:bg-black dark:shadow-black md:px-12 md:py-8"
      action={dispatch}
      noValidate
    >
      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <FormLegend icon={TruckIcon}>Información del proveedor</FormLegend>
        </div>
        <FieldsWrapper>
          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="rfc"
                name="rfc"
                label="RFC"
                maxLength={12}
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
          <div className="w-full">
            <Input
              id="name"
              name="name"
              label="Nombre"
              isInvalid={hasItems(state.errors.name)}
              errorMessage={state.errors.name?.join(', ')}
            />
          </div>
        </FieldsWrapper>
      </fieldset>

      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <FormLegend icon={IdentificationIcon}>
            Credenciales de acceso
          </FormLegend>
        </div>
        <FieldsWrapper>
          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="email"
                name="email"
                label="Correo electrónico"
                type="text"
                isInvalid={hasItems(state.errors.email)}
                errorMessage={state.errors.email?.join(', ')}
              />
            </div>

            <div className="md:w-1/2">
              <Select
                id="type"
                name="type"
                label="Rol"
                isInvalid={hasItems(state.errors.type)}
                errorMessage={state.errors.type?.join(', ')}
              >
                {userTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </Fields>

          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="password"
                name="password"
                label="Contraseña"
                type={isVisible ? 'text' : 'password'}
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

            <div className="md:w-1/2">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                label="Confirmar contraseña"
                type={isVisible ? 'text' : 'password'}
                isInvalid={hasItems(state.errors.password)}
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
    </form>
  );
}
