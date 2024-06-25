'use server';

import prisma from '@/app/lib/database/prisma';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import nodemailer from 'nodemailer';
import { signIn } from '@/auth';
import { findUserByUsername, updateUserOTP } from '../database/user';
import { z } from 'zod';

const mailUser = process.env.MAIL_USER;

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', {
      username: formData.get('username'),
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
  username: z.string().min(4, {
    message: 'El usuario debe tener al menos 4 caracteres.',
  }),
});

export async function sendRecoveryCode(
  prevState: any,
  formData: FormData
): Promise<{
  errors: { username?: string[] | undefined };
  step: 'username' | 'otp' | '';
  message: string;
  userID?: number;
}> {
  const username = formData.get('username')?.toString();
  const validatedData = FormSchema.safeParse({ username });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      step: 'username',
      message: '',
    };
  }

  try {
    const user = await findUserByUsername(validatedData.data.username);
    if (user && user.isActive) {
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
        to: user.email,
        subject: 'Código de recuperación',
        text: `${user.name} ha solicitado un código de recuperación para el usuario ${user.username}. El código de recuperación es: ${otp}. Este código expirará en 10 minutos.`,
      };

      await transporter.sendMail(mailOptions);
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
      step: 'username',
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
      isActive: true,
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
