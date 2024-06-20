'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * A button component that submits a form and includes a check circle icon.
 * Uses the useFormStatus hook to automatically disable the button when the form is pending and show a loading spinner.
 */

export default function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      color="success"
      variant="shadow"
      type="submit"
      isLoading={pending}
      isDisabled={pending}
    >
      Finalizar
      <CheckCircleIcon className="w-6" />
    </Button>
  );
}
