'use client';

import { createProvider } from '@/app/lib/actions';
import {
  CheckCircleIcon,
  IdentificationIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { FormErrors } from '../form-errors';
import { hasItems } from '@/app/lib/utils';

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
  console.log(state);
  return (
    <form
      className="rounded-xl border bg-white px-12 py-8 shadow"
      action={dispatch}
      noValidate
    >
      <div className="mb-6 flex items-center">
        <TruckIcon className="mr-2 w-8 text-primary-500" />
        <h2 className="text-lg text-primary-500">Información del proveedor</h2>
      </div>
      <div className="mb-8 flex flex-wrap gap-4">
        <div className="flex w-full gap-4">
          <div className="w-1/2">
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
          <div className="w-1/2">
            <Input
              id="zipcode"
              name="zipcode"
              label="Código postal"
              isInvalid={hasItems(state.errors.zipcode)}
              errorMessage={state.errors.zipcode?.join(', ')}
            />
          </div>
        </div>
        <div className="w-full">
          <Input
            id="name"
            name="name"
            label="Nombre"
            isInvalid={hasItems(state.errors.name)}
            errorMessage={state.errors.name?.join(', ')}
          />
        </div>
      </div>
      <div className="mb-6 flex items-center">
        <IdentificationIcon className="mr-2 w-8 text-primary-500" />
        <h2 className="text-lg text-primary-500">Credenciales de acceso</h2>
      </div>
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-full">
          <Input
            id="email"
            name="email"
            label="Correo electrónico"
            type="text"
            isInvalid={hasItems(state.errors.email)}
            errorMessage={state.errors.email?.join(', ')}
          />
        </div>

        <div className="flex w-full gap-4">
          <div className="w-1/2">
            <Input
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              isInvalid={hasItems(state.errors.password)}
              errorMessage={state.errors.password?.join(', ')}
            />
          </div>

          <div className="w-1/2">
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
        </div>
      </div>
      <div className="flex items-center justify-between">
        {state.message && <p className="w-full text-danger">{state.message}</p>}
        <div className="w-full text-right">
          <Button
            className="mr-2"
            href="/dashboard/providers"
            variant="flat"
            as={Link}
          >
            Cancelar
          </Button>
          <CreateButton />
        </div>
      </div>
    </form>
  );
}

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <Button color="success" variant="shadow" type="submit" isLoading={pending}>
      Finalizar
      <CheckCircleIcon className="w-6" />
    </Button>
  );
}
