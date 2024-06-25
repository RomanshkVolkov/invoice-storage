'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import {
  createProvider as newProvider,
  updateProvider,
  deleteProvider as delProvider,
  checkExistingProvider,
} from '../database/providers';

import { Errors, FormSchema } from '../schemas/providers.schema';
import { handleDatabaseError } from '../utils';

export async function createProvider(
  assignedUsers: string[],
  prevState: any,
  formData: FormData
): Promise<{ errors: Errors; message: string }> {
  const data = {
    assignedUsers: assignedUsers.map((id) => +id),
    ...Object.fromEntries(formData),
  };

  const validatedData = FormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  const users = validatedData.data.assignedUsers;

  const provider = {
    email: validatedData.data.email,
    name: validatedData.data.name,
    rfc: validatedData.data.rfc.toUpperCase(),
    zipcode: validatedData.data.zipcode,
  };

  try {
    const providerExists = await checkExistingProvider(provider.rfc);
    if (providerExists) {
      return {
        errors: {
          rfc: ['El RFC ya está registrado.'],
        },
        message: 'Revisa los campos marcados en rojo.',
      };
    }
  } catch (error) {
    return handleDatabaseError(
      error,
      'Ha ocurrido un error al verificar el RFC.'
    );
  }

  try {
    await newProvider(provider, users);
  } catch (error) {
    return handleDatabaseError(
      error,
      'Ha ocurrido un error al crear el proveedor.'
    );
  }

  revalidatePath('/dashboard/providers');
  redirect('/dashboard/providers');
}

export async function editProvider(
  providerID: number,
  assignedUsers: string[] | number[],
  prevState: any,
  formData: FormData
): Promise<{ errors: Errors; message: string }> {
  const data = {
    assignedUsers: assignedUsers.map((id) => +id),
    ...Object.fromEntries(formData),
  };

  const validatedData = FormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  const users = validatedData.data.assignedUsers;

  const provider = {
    id: providerID,
    name: validatedData.data.name,
    email: validatedData.data.email,
    rfc: validatedData.data.rfc.toUpperCase(),
    zipcode: validatedData.data.zipcode,
  };

  try {
    const providerExists = await checkExistingProvider(
      provider.rfc,
      providerID
    );
    if (providerExists) {
      return {
        errors: {
          rfc: ['El RFC ya está registrado.'],
        },
        message: 'Revisa los campos marcados en rojo.',
      };
    }
  } catch (error) {
    return handleDatabaseError(
      error,
      'Ha ocurrido un error al verificar el RFC.'
    );
  }

  try {
    await updateProvider(provider, users);
  } catch (error) {
    return handleDatabaseError(
      error,
      'Ha ocurrido un error al editar el proveedor.'
    );
  }

  revalidatePath('/dashboard/providers');
  redirect('/dashboard/providers');
}

export async function deleteProvider(id: number) {
  const session = await auth();
  if (+(session?.user?.provider?.id || '') === id) {
    return {
      errors: {},
      message: 'No puedes eliminar tu propia cuenta.',
    };
  }
  try {
    await delProvider(id);
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message:
        'Ha ocurrido un error al eliminar el proveedor, por favor, contacta a soporte.',
    };
  }
  revalidatePath('/dashboard/providers');
}
