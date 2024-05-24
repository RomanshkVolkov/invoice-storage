'use server';

import { AuthError } from 'next-auth';
import prisma from '@/app/lib/database/prisma';
import { signIn } from '@/auth';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales incorrectas.';
        default:
          return 'Ha ocurrido un error. Por favor, intenta de nuevo.';
      }
    }
    throw error;
  }
}

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  type: z.string(),
  name: z.string(),
  rfc: z.string().length(12),
  zipcode: z.string(),
});

export async function createProvider(prevState: any, formData: FormData) {
  console.log(prevState);
  const validatedData = FormSchema.safeParse(Object.fromEntries(formData));

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Por favor, revisa los campos marcados en rojo.',
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

  await prisma.$transaction(async (context) => {
    const userCreated = await context.users.create({
      data: user,
    });

    await context.providers.create({
      data: {
        ...provider,
        userID: userCreated.id,
      },
    });
  });

  revalidatePath('/dashboard/providers');
  redirect('/dashboard/providers');
}
