'use client';

import {
  CheckIcon,
  IdentificationIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';

export default function CreateProviderForm({
  userTypes,
}: {
  userTypes: {
    id: number;
    name: string;
  }[];
}) {
  return (
    <form className="rounded-xl border bg-white px-12 py-8 shadow">
      <div className="mb-6 flex items-center">
        <TruckIcon className="mr-2 w-8" />
        <p className="text-lg">Información del proveedor</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="flex w-full gap-4">
          <Input label="RFC" maxLength={13} className="w-1/2" />
          <Input label="Código postal" className="w-1/2" />
        </div>
        <Input label="Nombre" className="w-full" />
      </div>
      <div className="mb-6 flex items-center">
        <IdentificationIcon className="mr-2 w-8" />
        <p className="text-lg">Credenciales de acceso</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-4">
        <Input label="Correo electrónico" type="email" />
        <div className="flex w-full gap-4">
          <Input
            label="Contraseña"
            type="password"
            minLength={6}
            className="w-1/2"
          />
          <Select label="Rol" className="w-1/2">
            {userTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </Select>
        </div>
      </div>

      <Button color="primary" size="lg">
        Finalizar
        <CheckIcon className="w-6" />
      </Button>
    </form>
  );
}
