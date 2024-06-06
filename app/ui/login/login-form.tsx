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
import { authenticate } from '@/app/lib/actions/auth.actions';
import Link from 'next/link';

export default function Form() {
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
        data-testid="email-field"
        className="mb-4"
        errorMessage="Por favor, ingresa un correo válido"
        isClearable
        isRequired
      />
      <Input
        name="password"
        label="Contraseña"
        id="password"
        data-testid="password-field"
        minLength={6}
        className="mb-2"
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
      <div className="mb-6">
        <Link href="/forgot-password">
          <span className="text-sm text-gray-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </span>
        </Link>
      </div>
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
      data-testid="submit-button"
      className="relative m-auto w-full"
      size="lg"
      variant="shadow"
      aria-disabled={pending}
      isDisabled={pending}
      isLoading={pending}
    >
      Acceder
      <ArrowLongRightIcon className="absolute right-4 ml-auto w-6 " />
    </Button>
  );
}
