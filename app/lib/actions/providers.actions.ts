'use server';

import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { checkExistingUser } from '../database/user';
import { checkExistingProvider } from '../database/providers';
import { createProvider as newProvider } from '../database/providers';

const FormSchema = z.object({
  email: z.string().email({
    message: 'Por favor, ingresa un correo válido.',
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.',
  }),
  type: z.coerce.number({
    message: 'Por favor, selecciona un tipo de usuario.',
  }),
  name: z
    .string({
      message: 'Nombre inválido.',
    })
    .min(1, {
      message: 'Por favor, ingresa un nombre.',
    }),
  rfc: z.string().length(12, {
    message: 'El RFC debe tener 12 caracteres.',
  }),
  zipcode: z.coerce
    .number({
      message: 'El código postal debe ser un número.',
    })
    .min(1, {
      message: 'Por favor, ingresa un código postal.',
    }),
});

export async function createProvider(prevState: any, formData: FormData) {
  const validatedData = FormSchema.safeParse(Object.fromEntries(formData));

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

  try {
    const isEmailRegistered = await checkExistingUser(user.email);
    const isProviderRegistered = await checkExistingProvider(provider.rfc);
    if (isEmailRegistered || isProviderRegistered) {
      return {
        errors: {
          email: isEmailRegistered
            ? ['El correo ya está registrado.']
            : undefined,
          name: undefined,
          rfc: isProviderRegistered
            ? ['El proveedor ya está registrado.']
            : undefined,
          zipcode: undefined,
          type: undefined,
          password: undefined,
        },
        message: 'Revisa los campos marcados en rojo.',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message:
        'Ha ocurrido un error al verificar el correo, por favor, intenta de nuevo.',
    };
  }

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
