'use client';

import { useFormState } from 'react-dom';
import { Button, Input } from '@nextui-org/react';
import {
  CloudArrowUpIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import { uploadInvoice } from '@/app/lib/actions/invoices.actions';
import FormError from '../form-error';
import Link from 'next/link';
import SubmitButton from '../dashboard/submit-button';

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
  console.log(!''.trim());

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
        <div className="mb-5 text-gray-500 dark:text-gray-400">
          <div className="flex flex-row justify-start">
            <InformationCircleIcon className="mr-2 w-6" />
            <p>
              Nota: Si arrastras y sueltas los archivos, ingresa primero el
              UUID.
            </p>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400">o</p>
        <div className="flex flex-col gap-4 md:flex-row">
          <Button
            id="pdf"
            name="pdf"
            variant="bordered"
            onClick={() => handleClickFileInput('pdf')}
            aria-label="Cargar pdf"
            color={inputPDF ? 'primary' : 'default'}
          >
            Cargar pdf
          </Button>
          <Button
            id="xml"
            name="xml"
            variant="bordered"
            onClick={() => handleClickFileInput('xml')}
            aria-label="Cargar xml"
            color={inputXML ? 'primary' : 'default'}
          >
            Cargar xml
          </Button>
        </div>
        <Input id="uuid" name="uuid" type="text" label="UUID" />
      </div>
      <div className="mt-4 w-full" />
      <FormError>
        <div className="grid w-full grid-cols-1 md:grid-cols-2 ">
          {task && (
            <div className="flex w-full justify-between">
              <ExclamationCircleIcon
                className={`mr-2 h-5 ${task.done === true ? 'text-green-600' : 'text-red-500'}`}
              />
              <p
                className={`w-full text-sm ${task.done === true ? 'text-green-600' : 'text-red-500'}`}
              >
                {task.message}
              </p>
            </div>
          )}
          <div className="mt-4 flex w-full justify-between sm:justify-end md:mt-0">
            <Button
              className="mr-2"
              href="/dashboard/invoices"
              variant="flat"
              as={Link}
            >
              Cancelar
            </Button>
            <SubmitButton />
          </div>
        </div>
      </FormError>
    </form>
  );
}
