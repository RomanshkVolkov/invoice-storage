'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button, Input } from '@nextui-org/react';
import {
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import React, { useState } from 'react';
import { uploadInvoice } from '@/app/lib/actions/invoices.actions';

export default function Form() {
  const [inputPDF, setInputPDF] = useState<boolean | null | undefined>(null);
  const [inputXML, setInputXML] = useState<boolean | null | undefined>(null);
  const [task, dispatch] = useFormState(uploadInvoice, undefined);

  const handleClickFileInput = (key: string) => {
    const fileInput = document.getElementById(key) as HTMLInputElement;
    fileInput.click();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const fileInputPdf = document.getElementById('pdf') as HTMLInputElement;
    const fileInputXml = document.getElementById('xml') as HTMLInputElement;
    const files = e.dataTransfer.files;
    Array.from(files).reduce(
      (acc, file) => {
        const dt = new DataTransfer();
        dt.items.add(file);
        if (file.type === 'application/pdf') {
          fileInputPdf.files = dt.files;
          setInputPDF(true);
          acc.pdf = true;
        }
        if (file.type === 'text/xml') {
          fileInputXml.files = dt.files;
          setInputXML(true);
          acc.xml = true;
        }
        return acc;
      },
      { pdf: false, xml: false }
    );
    if (fileInputPdf.form) {
      (
        fileInputPdf.form.querySelector(
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

  return (
    <form id="upload-file" action={dispatch}>
      <input
        id="pdf"
        name="pdf"
        type="file"
        className="h-0 w-0"
        accept="application/pdf"
        onChange={(e) =>
          setInputPDF(
            e.target.files && e.target.files?.length > 0 ? true : false
          )
        }
      />
      <input
        id="xml"
        name="xml"
        type="file"
        className="h-0 w-0"
        accept="text/xml"
        onChange={(e) =>
          setInputXML(
            e.target.files && e.target.files?.length > 0 ? true : false
          )
        }
      />

      <div className="mb-5 text-gray-500 dark:text-gray-400">
        <div className="flex flex-row justify-start">
          <InformationCircleIcon className="mr-2 w-6" />
          <p>
            Nota: El bóton de carga se volverá azul cuando se haya cargado el
            archivo correspondiente.
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center space-y-6">
        <div
          className="flex h-56 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-400"
          onDrop={handleDrop}
          onDragOver={handleOnDragOver}
          aria-label="Drop files here to upload"
        >
          <CloudArrowUpIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
          <p className="p-4 text-center text-gray-500 dark:text-gray-400">
            Arrastra y suelta tus archivos aquí, debes subir el PDF y XML de tu
            factura al mismo tiempo.
          </p>
        </div>
        <p className="text-gray-500 dark:text-gray-400">o</p>
        <div className="flex flex-col gap-4 md:flex-row">
          <Button
            id="pdf"
            name="pdf"
            variant="bordered"
            onClick={() => handleClickFileInput('pdf')}
            aria-label="Cargar pdf"
            className={clsx({
              'dark:bg-primary-dark bg-primary': inputPDF,
            })}
          >
            Cargar pdf
          </Button>
          <Button
            id="xml"
            name="xml"
            variant="bordered"
            onClick={() => handleClickFileInput('xml')}
            aria-label="Cargar xml"
            className={clsx({
              'dark:bg-primary-dark bg-primary': inputXML,
            })}
          >
            Cargar xml
          </Button>
        </div>
        <Input id="uuid" name="uuid" type="text" label="UUID" />
        <UploadStatus />
      </div>

      <div className="mt-2 flex gap-1" aria-live="polite" aria-atomic="true">
        {task && (
          <>
            <ExclamationCircleIcon
              className={`h-5 w-5 ${task.done === true ? 'text-green-600' : 'text-red-500'}`}
            />
            <p
              className={`text-sm ${task.done === true ? 'text-green-600' : 'text-red-500'}`}
            >
              {task.message}
            </p>
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
      <Button
        id="upload-files"
        type="submit"
        aria-label="Guardar"
        isLoading={pending}
      >
        Guardar
      </Button>
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
