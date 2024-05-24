'use client';

import { createProvider } from '@/app/lib/actions';
import {
  CheckIcon,
  IdentificationIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useFormState, useFormStatus } from 'react-dom';

interface UserType {
  id: number;
  name: string;
}

export default function CreateProviderForm({
  userTypes,
}: {
  userTypes: UserType[];
}) {
  const initialState = {
    message: null,
    errors: {},
  } as any;
  const [state, dispatch] = useFormState(createProvider, initialState);
  console.log(state);

  return (
    <form
      className="rounded-xl border bg-white px-12 py-8 shadow"
      action={dispatch}
    >
      <div className="mb-6 flex items-center">
        <TruckIcon className="mr-2 w-8" />
        <p className="text-lg">Información del proveedor</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex w-full gap-4">
          <Input
            id="rfc"
            name="rfc"
            label="RFC"
            maxLength={13}
            className="w-1/2"
          />
          <Input
            id="zipcode"
            name="zipcode"
            label="Código postal"
            className="w-1/2"
          />
        </div>
        <Input id="name" name="name" label="Nombre" className="w-full" />
      </div>
      <div className="mb-6 flex items-center">
        <IdentificationIcon className="mr-2 w-8" />
        <p className="text-lg">Credenciales de acceso</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-4">
        <Input
          id="email"
          name="email"
          label="Correo electrónico"
          type="email"
        />
        <div className="flex w-full gap-4">
          <Input
            id="password"
            name="password"
            label="Contraseña"
            type="password"
            minLength={6}
            className="w-1/2"
          />
          <Select id="type" name="type" label="Rol" className="w-1/2">
            {userTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>
      <CreateButton />
    </form>
  );
}

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <Button color="primary" size="lg" type="submit" isLoading={pending}>
      Finalizar
      <CheckIcon className="w-6" />
    </Button>
  );
}
