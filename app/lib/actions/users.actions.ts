'use server';
import bcrypt from 'bcrypt';
import { createUser, deleteUserByID, updateUserByID } from '../database/user';
import { Errors, FormSchema } from '../schemas/users.schema';
import { redirect } from 'next/navigation';
import { handleDatabaseError } from '../utils';
import { revalidatePath } from 'next/cache';

export async function createNewUser(
  prevState: any,
  formData: FormData
): Promise<{ errors: Errors; message: string }> {
  const data = Object.fromEntries(formData);
  const validatedData = FormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }
  const password = bcrypt.hashSync(validatedData.data.password, 10);

  const newUser = {
    name: validatedData.data.name,
    username: validatedData.data.username,
    email: validatedData.data.email,
    password,
    userTypeID: Number(validatedData.data.userTypeID),
    isActive: Boolean(validatedData.data.isActive),
  };

  try {
    await createUser(newUser);
  } catch (error) {
    return handleDatabaseError(
      error,
      'Ha ocurrido un error al editar el proveedor.'
    );
  }
  const path = '/dashboard/users';
  revalidatePath(path);
  redirect(path);
}

export async function editUserByID(
  id: number,
  prevState: any,
  formData: FormData
): Promise<{ errors: Errors; message: string }> {
  const data = Object.fromEntries(formData);
  const validatedData = FormSchema.safeParse(data);
  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  const user = {
    id,
    name: validatedData.data.name,
    email: validatedData.data.email,
    username: validatedData.data.username,
    userTypeID: Number(validatedData.data.userTypeID),
    isActive: Boolean(validatedData.data.isActive),
  };

  try {
    await updateUserByID(user);
  } catch (error) {
    return handleDatabaseError(
      error,
      'Ha ocurrido un error al editar el usuario.'
    );
  }
  const path = '/dashboard/users';
  revalidatePath(path);
  redirect(path);
}

export async function deleteUser(id: number) {
  return await deleteUserByID(id);
}
