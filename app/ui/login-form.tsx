'use client';

import { Input, Button } from '@nextui-org/react';
import { useState } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowLongRightIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { authenticate } from '@/app/lib/actions';

export default function Form() {
  const { pending } = useFormStatus();
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form action={dispatch}>
      <Input
        label="Email"
        type="email"
        name="email"
        id="email"
        className="mb-4"
        errorMessage="Por favor, ingresa un correo válido"
        isClearable
        isRequired
      />
      <Input
        name="password"
        label="Contraseña"
        minLength={6}
        className="mb-6"
        type={isVisible ? 'text' : 'password'}
        errorMessage="La contraseña debe tener al menos 6 caracteres."
        isRequired
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
      <LoginButton />
      <div className="mt-2 flex gap-1" aria-live="polite" aria-atomic="true">
        {errorMessage && (
          <>
            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
            <p className="text-sm text-danger-400">{errorMessage}</p>
          </>
        )}
      </div>
    </form>
  );
}

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      color="primary"
      className="m-auto w-full"
      size="lg"
      aria-disabled={pending}
      isDisabled={pending}
      isLoading={pending}
      endContent={
        <ArrowLongRightIcon width={28} className="absolute right-6" />
      }
    >
      Acceder
    </Button>
  );
}
