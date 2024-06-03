'use server';

import prisma from '@/app/lib/database/prisma';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import nodemailer from 'nodemailer';
import { signIn } from '@/auth';
import { findUserByEmail, updateUserOTP } from '../database/user';
import { z } from 'zod';

const mailUser = process.env.MAIL_USER;

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
});

export async function sendRecoveryCode(
  prevState: any,
  formData: FormData
): Promise<{
  errors: { email?: string[] | undefined };
  step: 'email' | 'otp' | '';
  message: string;
  userID?: number;
}> {
  const email = formData.get('email')?.toString();
  const validatedData = FormSchema.safeParse({ email });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      step: 'email',
      message: '',
    };
  }

  try {
    const user = await findUserByEmail(validatedData.data.email);
    if (user) {
      //create a random 6 digit number
      const otp = crypto.randomInt(100000, 1000000);
      const otpExpireDate = new Date();
      otpExpireDate.setMinutes(otpExpireDate.getMinutes() + 10);

      await updateUserOTP({
        id: user.id,
        otp,
        otpExpireDate,
      });

      const transporter = nodemailer.createTransport({
        service: 'Outlook365',
        auth: {
          user: mailUser,
          pass: process.env.MAIL_PASS,
        },
      });

      const mailOptions = {
        from: `"Invoice Storage" <${mailUser}>`,
        to: formData.get('email')?.toString(),
        subject: 'Código de recuperación',
        text: `Tu código de recuperación es: ${otp}. Este código expirará en 10 minutos.`,
      };

      transporter.sendMail(mailOptions);
    }

    return {
      errors: {},
      step: 'otp',
      message: '',
      userID: user?.id,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      step: 'email',
      message:
        'Ha ocurrido un error al enviar el código de recuperación, por favor, contacta a soporte.',
    };
  }
}

export async function validateOTP(
  userID: number,
  prevState: any,
  formData: FormData
): Promise<{
  errors: { otp?: string[] | undefined };
  userID?: number;
}> {
  const otpObject = Object.fromEntries(formData.entries());
  const otp = Object.values(otpObject).join('');
  const user = await prisma.users.findFirst({
    where: {
      otp: +otp,
      id: userID,
    },
    select: {
      otpExpireDate: true,
      id: true,
    },
  });

  if (!user || !user.otpExpireDate) {
    return {
      errors: {
        otp: ['El código de recuperación es incorrecto.'],
      },
    };
  }

  const now = new Date();
  if (user.otpExpireDate < now) {
    return {
      errors: {
        otp: ['El código de recuperación ha expirado.'],
      },
    };
  }

  return {
    errors: {},
    userID: user.id,
  };
}

const PassFormSchema = z.object({
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.',
  }),
  passwordConfirm: z.string({
    message: 'Por favor, confirma tu contraseña.',
  }),
});

export async function resetPassword(
  userID: number,
  prevState: any,
  formData: FormData
): Promise<{
  errors: {
    password?: string[] | undefined;
    passwordConfirm?: string[] | undefined;
  };
  done?: boolean;
}> {
  const validatedData = PassFormSchema.safeParse({
    password: formData.get('password')?.toString(),
    passwordConfirm: formData.get('passwordConfirm')?.toString(),
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { password, passwordConfirm } = validatedData.data;

  if (password !== passwordConfirm) {
    return {
      errors: {
        password: ['Las contraseñas no coinciden.'],
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.users.update({
      where: {
        id: userID,
      },
      data: {
        password: hashedPassword,
        otp: null,
        otpExpireDate: null,
      },
    });

    return {
      errors: {},
      done: true,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        password: ['Ha ocurrido un error al actualizar la contraseña.'],
      },
    };
  }
}
