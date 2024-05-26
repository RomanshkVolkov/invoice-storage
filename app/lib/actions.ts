'use server';

import { AuthError } from 'next-auth';
import prisma from '@/app/lib/database/prisma';
import { signIn } from '@/auth';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import email from 'next-auth/providers/email';

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
    const isEmailRegistered = !!(await prisma.users.findFirst({
      where: {
        email: user.email,
      },
    }));
    const isProviderRegistered = !!(await prisma.providers.findFirst({
      where: {
        rfc: provider.rfc,
      },
    }));
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
