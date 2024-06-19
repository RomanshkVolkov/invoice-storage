'use client';

import {
  BuildingOfficeIcon,
  CheckCircleIcon,
  EnvelopeIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import { hasItems } from '@/app/lib/utils';
import { Companies } from '@prisma/client';
import { editCompany } from '@/app/lib/actions/companies.actions';
import { useState } from 'react';

type Errors = {
  rfc?: string[] | undefined;
  name?: string[] | undefined;
  prefix?: string[] | undefined;
  [key: string]: string[] | undefined;
};

type Company = Omit<Companies, 'isDeletable' | 'isDeleted'>;

export default function EditCompanyForm({ company }: { company: Company }) {
  const [emails, setEmails] = useState(company.emails?.split(';') || []);
  const editCompanyWithId = editCompany.bind(null, company.id);
  const initialState = {
    message: '',
    errors: {} as Errors,
  };
  const [state, dispatch] = useFormState(editCompanyWithId, initialState);

  return (
    <form
      aria-describedby="form-error"
      className="rounded-xl border bg-white px-12 py-8 shadow-xl dark:border-none dark:bg-black dark:shadow-black"
      action={dispatch}
      noValidate
    >
      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <BuildingOfficeIcon className="mr-2 w-8 text-primary-500" />
          <legend className="text-lg text-primary-500">
            Información de la empresa
          </legend>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="w-full gap-4 md:flex">
            <div className="mb-4 md:mb-0 md:w-1/3">
              <Input
                id="rfc"
                name="rfc"
                label="RFC"
                maxLength={12}
                formNoValidate
                isInvalid={hasItems(state.errors.rfc)}
                errorMessage={state.errors.rfc?.join(', ')}
                defaultValue={company.rfc}
              />
            </div>
            <div className="md:w-1/3">
              <Input
                id="name"
                name="name"
                label="Nombre"
                isInvalid={hasItems(state.errors.name)}
                errorMessage={state.errors.name?.join(', ')}
                defaultValue={String(company.name) || ''}
              />
            </div>
            <div className="md:w-1/3">
              <Input
                id="prefix"
                name="prefix"
                label="Alias"
                isInvalid={hasItems(state.errors.prefix)}
                errorMessage={state.errors.prefix?.join(', ')}
                defaultValue={company.prefix || ''}
              />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <EnvelopeIcon className="mr-2 w-8 text-primary-500" />
          <legend className="text-lg text-primary-500">Lista de correos</legend>
          <Button
            color="primary"
            variant="shadow"
            className="ml-auto"
            onClick={() => setEmails([...emails, ''])}
          >
            Agregar correo
            <PlusIcon className="w-6" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="w-full">
            <Table aria-label="Company emails" removeWrapper>
              <TableHeader>
                <TableColumn>CORREO ELECTRÓNICO</TableColumn>
                <TableColumn className="text-center">Eliminar</TableColumn>
              </TableHeader>
              <TableBody>
                {emails.map((email, index) => (
                  <TableRow key={index}>
                    <TableCell className="p-1 pl-0">
                      <Input
                        aria-label={`Correo número ${index + 1}`}
                        placeholder="Escribir..."
                        radius="sm"
                        size="sm"
                        id={`email-${index}`}
                        name={`email-${index}`}
                        isInvalid={hasItems(
                          (state.errors as Record<string, string[]>)[
                            `email-${index}`
                          ]
                        )}
                        errorMessage={(
                          state.errors as Record<string, string[]>
                        )[`email-${index}`]?.join('; ')}
                        defaultValue={email}
                        isClearable
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        size="sm"
                        color="danger"
                        variant="shadow"
                        isIconOnly
                        onClick={() =>
                          setEmails(emails.filter((_, i) => i !== index))
                        }
                      >
                        <TrashIcon className="w-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </fieldset>

      <div
        aria-live="polite"
        aria-atomic="true"
        id="form-error"
        className="flex items-center justify-between"
      >
        {state.message && <p className="w-full text-danger">{state.message}</p>}
        <div className="flex w-full justify-between sm:justify-end">
          <Button
            className="mr-2"
            href="/dashboard/companies"
            variant="flat"
            as={Link}
          >
            Cancelar
          </Button>
          <CreateButton />
        </div>
      </div>
    </form>
  );
}

function CreateButton() {
  const { pending } = useFormStatus();
  return (
    <Button color="success" variant="shadow" type="submit" isLoading={pending}>
      Finalizar
      <CheckCircleIcon className="w-6" />
    </Button>
  );
}
