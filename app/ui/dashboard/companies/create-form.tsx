'use client';

import { useState } from 'react';
import { useFormState } from 'react-dom';
import {
  Button,
  Input,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import {
  BuildingOfficeIcon,
  EnvelopeIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import { createCompany } from '@/app/lib/actions/companies.actions';
import { hasItems } from '@/app/lib/utils';
import SubmitButton from '../submit-button';
import FormLegend from '../../form-legend';
import Form from '../../form';
import FormError from '../../form-error';
import Fields from '../../fields';
import FieldsWrapper from '../../fields-wrapper';

interface Errors {
  rfc?: string[] | undefined;
  name?: string[] | undefined;
  prefix?: string[] | undefined;
  emails?: string[] | undefined;
}

export default function CreateCompanyForm() {
  const [emails, setEmails] = useState<string[]>([]);

  const initialState = {
    message: '',
    errors: {} as Errors,
  };
  const [state, dispatch] = useFormState(createCompany, initialState);

  return (
    <Form action={dispatch}>
      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <FormLegend icon={BuildingOfficeIcon}>
            Información de la empresa
          </FormLegend>
        </div>
        <FieldsWrapper>
          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/3">
              <Input
                id="rfc"
                name="rfc"
                label="RFC"
                maxLength={12}
                formNoValidate
                isInvalid={hasItems(state.errors.rfc)}
                errorMessage={state.errors.rfc?.join(', ')}
              />
            </div>
            <div className="md:w-1/3">
              <Input
                id="name"
                name="name"
                label="Nombre"
                isInvalid={hasItems(state.errors.name)}
                errorMessage={state.errors.name?.join(', ')}
              />
            </div>
            <div className="md:w-1/3">
              <Input
                id="prefix"
                name="prefix"
                label="Alias"
                isInvalid={hasItems(state.errors.prefix)}
                errorMessage={state.errors.prefix?.join(', ')}
              />
            </div>
          </Fields>
        </FieldsWrapper>
      </fieldset>

      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <FormLegend icon={EnvelopeIcon}>Lista de correos</FormLegend>
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
        <FieldsWrapper>
          <Fields>
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
          </Fields>
        </FieldsWrapper>
      </fieldset>

      <FormError>
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
          <SubmitButton />
        </div>
      </FormError>
    </Form>
  );
}
