'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button, Input } from '@nextui-org/react';
import { validateInvoice } from '@/app/lib/actions/invoice.actions';
import {
  CloudArrowUpIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function Form() {
  const [errorMessage, dispatch] = useFormState(validateInvoice, undefined);

  const handleClickFileInput = () => {
    const fileInput = document.getElementById('files') as HTMLInputElement;
    fileInput.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fileInput = document.getElementById('files') as HTMLInputElement;
    const files = e.dataTransfer.files;
    if (fileInput.form) {
      fileInput.files = files;
      (
        fileInput.form.querySelector(
          'button[type="submit"]'
        ) as HTMLInputElement
      )?.click();
    }
  };

  const handleOnDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const input = e.target as HTMLInputElement;
    input.classList.toggle('border-blue-500');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const form = e.target.form as HTMLFormElement;
    const submit = form.querySelector(
      'button[type="submit"]'
    ) as HTMLButtonElement;
    if (submit) {
      submit.click();
    }
  };
  return (
    <form id="upload-file" action={dispatch}>
      <input
        id="files"
        name="files"
        type="file"
        multiple
        className="h-0 w-0"
        onChange={handleChange}
      />
      <div className="flex flex-col items-center justify-center space-y-6">
        <div
          className="flex h-56 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400"
          onDrop={handleDrop}
          onDragOver={handleOnDragOver}
        >
          <CloudArrowUpIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
          <p className="p-4 text-gray-500 dark:text-gray-400">
            Arrastra y suelta tus archivos aquí
          </p>
        </div>
        <p className="text-gray-500 dark:text-gray-400">o</p>
        <Button variant="bordered" onClick={handleClickFileInput}>
          Selecciona tus archivos
        </Button>
        <Input id="uuid" name="uuid" type="text" label="UUID" />
        <UploadStatus />
      </div>

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

function UploadStatus() {
  const { pending } = useFormStatus();

  return (
    <>
      <button id="upload-files" type="submit" className="hidden h-0 w-0" />
      <div className="w-full">
        <div className="h-2 overflow-hidden rounded">
          <div
            className={clsx('h-full w-0 bg-blue-500', {
              'progress-bar': pending,
            })}
          />
        </div>
      </div>
    </>
  );
}
