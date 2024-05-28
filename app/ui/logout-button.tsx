'use client';

import { PowerIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

export default function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="relative flex w-full grow items-center gap-2 bg-primary-500 text-sm font-medium text-white transition-all md:flex-none md:justify-center"
      size="lg"
      variant="shadow"
      type="submit"
      isLoading={pending}
    >
      Cerrar sesión
      <PowerIcon className="absolute right-4 ml-auto w-6" />
    </Button>
  );
}
