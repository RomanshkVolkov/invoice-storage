'use server';

import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  createProvider as newProvider,
  updateProvider,
} from '../database/providers';
import {
  checkExistingEmailAndRFC,
  validateData,
  validatePasswords,
  validateUpdateData,
} from '../services/providers.service';
import { updateUser } from '../database/user';
import { deleteProvider as delProvider } from '../database/providers';
import { auth } from '@/auth';

export async function createProvider(prevState: any, formData: FormData) {
  const validatedData = await validateData(formData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  const user = {
    email: validatedData.data.email,
    password: await bcrypt.hash(validatedData.data.password, 10),
    userTypeID: +validatedData.data.type,
  };

  const provider = {
    name: validatedData.data.name,
    rfc: validatedData.data.rfc.toUpperCase(),
    zipcode: +validatedData.data.zipcode,
  };

  const passwordsNotMatch = validatePasswords(formData);
  if (passwordsNotMatch) return passwordsNotMatch;

  const existingData = await checkExistingEmailAndRFC(
    {
      rfc: provider.rfc,
    },
    {
      email: user.email,
    }
  );
  if (existingData) return existingData;

  try {
    await newProvider(provider, user);
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
  const validatedData = await validateUpdateData(formData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  const user = {
    id: userID,
    email: validatedData.data.email,
    userTypeID: +validatedData.data.type,
  };

  const provider = {
    id: providerID,
    name: validatedData.data.name,
    rfc: validatedData.data.rfc.toUpperCase(),
    zipcode: +validatedData.data.zipcode,
  };

  const existingData = await checkExistingEmailAndRFC(
    { rfc: provider.rfc, id: providerID },
    { email: user.email, id: userID }
  );

  if (existingData) return existingData;

  try {
    await updateUser(user);
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message:
        'Ha ocurrido un error al editar el usuario, por favor, contacta a soporte.',
    };
  }

  try {
    await updateProvider(provider);
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
