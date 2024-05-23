'use client';

import { Input, Button } from '@nextui-org/react';
import { useState } from 'react';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowLongRightIcon,
} from '@heroicons/react/24/outline';

export default function Form() {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form>
      <Input
        label="Email"
        type="email"
        className="mb-4"
        errorMessage="Por favor, ingresa un correo válido"
        isClearable
      />
      <Input
        label="Contraseña"
        className="mb-6"
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
        type={isVisible ? 'text' : 'password'}
        errorMessage="Por favor, ingresa tu contraseña"
      />
      <Button
        color="primary"
        className="m-auto w-full"
        size="lg"
        endContent={
          <ArrowLongRightIcon width={28} className="absolute right-6" />
        }
      >
        <span>Acceder</span>
      </Button>
    </form>
  );
}
