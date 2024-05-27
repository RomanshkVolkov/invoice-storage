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
  validateUpdateData,
} from '../services/providers.service';
import { updateUser } from '../database/user';

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

  const existingData = await checkExistingEmailAndRFC(
    { email: user.email },
    { rfc: provider.rfc }
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
    { email: user.email, id: userID },
    { rfc: provider.rfc, id: providerID }
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
