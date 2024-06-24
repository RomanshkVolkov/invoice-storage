'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcrypt';
import { auth } from '@/auth';
import {
  createProvider as newProvider,
  updateProvider,
  deleteProvider as delProvider,
} from '../database/providers';
import {
  checkExistingEmailAndRFC,
  validateData,
  validatePasswords,
  validateUpdateData,
} from '../services/providers.service';
import email from 'next-auth/providers/email';

export async function createProvider(prevState: any, formData: FormData) {
  const validatedData = validateData(formData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  const users = validatedData.data.users;

  const provider = {
    email: validatedData.data.email,
    name: validatedData.data.name,
    rfc: validatedData.data.rfc.toUpperCase(),
    zipcode: +validatedData.data.zipcode,
  };

  const passwordsNotMatch = validatePasswords(formData);
  if (passwordsNotMatch) return passwordsNotMatch;

  // const existingData = await checkExistingEmailAndRFC(provider, users);
  // if (existingData) return existingData;

  try {
    await newProvider(provider, users);
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message:
        'Ha ocurrido un error inesperado, por favor, contacta a soporte.',
    };
  }

  revalidatePath('/dashboard/providers');
  redirect('/dashboard/providers');
}

export async function editProvider(
  providerID: number,
  userID: number,
  prevState: any,
  formData: FormData
) {
  const validatedData = validateUpdateData(formData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  const users = validatedData.data.users;

  const provider = {
    id: providerID,
    name: validatedData.data.name,
    email: validatedData.data.email,
    rfc: validatedData.data.rfc.toUpperCase(),
    zipcode: +validatedData.data.zipcode,
  };

  // const existingData = await checkExistingEmailAndRFC(provider, user);

  // if (existingData) return existingData;

  try {
    await updateProvider(provider, users);
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message:
        'Ha ocurrido un error al editar el proveedor, por favor, contacta a soporte.',
    };
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
