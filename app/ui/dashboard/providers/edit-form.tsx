'use client';

import { editProvider } from '@/app/lib/actions/providers.actions';
import { IdentificationIcon, TruckIcon } from '@heroicons/react/24/outline';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import Link from 'next/link';
import { useFormState } from 'react-dom';
import { hasItems } from '@/app/lib/utils';
import { Provider, User } from '@/app/lib/types';
import SubmitButton from '../submit-button';
import FormLegend from '../../form-legend';
import Form from '../../form';
import FormError from '../../form-error';
import FieldsWrapper from '../../fields-wrapper';
import Fields from '../../fields';

interface Errors {
  rfc?: string[] | undefined;
  name?: string[] | undefined;
  zipcode?: string[] | undefined;
  type?: string[] | undefined;
  email?: string[] | undefined;
  password?: string[] | undefined;
}

export default function EditProviderForm({
  provider,
  userTypes,
}: {
  provider: Provider;
  userTypes: User['type'][];
}) {
  const editProviderWithIds = editProvider.bind(
    null,
    provider.id,
    provider.user.id
  );
  const initialState = {
    message: '',
    errors: {} as Errors,
  };
  const [state, dispatch] = useFormState(editProviderWithIds, initialState);

  return (
    <Form action={dispatch}>
      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <FormLegend icon={TruckIcon}>Información del proveedor</FormLegend>
        </div>
        <FieldsWrapper>
          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="rfc"
                name="rfc"
                label="RFC"
                maxLength={12}
                formNoValidate
                isInvalid={hasItems(state.errors.rfc)}
                errorMessage={state.errors.rfc?.join(', ')}
                defaultValue={provider.rfc}
              />
            </div>
            <div className="md:w-1/2">
              <Input
                id="zipcode"
                name="zipcode"
                label="Código postal"
                isInvalid={hasItems(state.errors.zipcode)}
                errorMessage={state.errors.zipcode?.join(', ')}
                defaultValue={String(provider.zipcode) || ''}
              />
            </div>
          </Fields>
          <div className="w-full">
            <Input
              id="name"
              name="name"
              label="Nombre"
              isInvalid={hasItems(state.errors.name)}
              errorMessage={state.errors.name?.join(', ')}
              defaultValue={provider.name}
            />
          </div>
        </FieldsWrapper>
      </fieldset>

      <fieldset className="mb-8">
        <div className="mb-6 items-center md:flex">
          <FormLegend icon={IdentificationIcon}>Acceso</FormLegend>
        </div>

        <FieldsWrapper>
          <Fields>
            <div className="mb-4 md:mb-0 md:w-1/2">
              <Input
                id="email"
                name="email"
                label="Correo electrónico"
                type="text"
                isInvalid={hasItems(state.errors.email)}
                errorMessage={state.errors.email?.join(', ')}
                defaultValue={provider.user.email}
              />
            </div>

            <div className="md:w-1/2">
              <Select
                id="type"
                name="type"
                label="Rol"
                isInvalid={hasItems(state.errors.type)}
                errorMessage={state.errors.type?.join(', ')}
                defaultSelectedKeys={new Set([provider.user.type.id])}
              >
                {userTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </Fields>
        </FieldsWrapper>
      </fieldset>

      <FormError>
        {state.message && <p className="w-full text-danger">{state.message}</p>}
        <div className="flex w-full justify-between sm:justify-end">
          <Button
            className="mr-2"
            href="/dashboard/providers"
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
