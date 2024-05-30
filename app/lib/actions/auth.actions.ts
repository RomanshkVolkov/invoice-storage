'use server';

import { AuthError } from 'next-auth';
import nodemailer from 'nodemailer';
import { signIn } from '@/auth';

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
    //await sendEmail();
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

export async function sendEmail() {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Outlook365',
      auth: {
        user: 'web@oceanleader.mx',
        pass: 'Pap29912',
      },
    });

    const mailOptions = {
      from: 'web@oceanleader.mx',
      to: 'diegogutcat28@gmail.com',
      subject: 'Test Email with OAuth2',
      text: 'Hello from Gmail using OAuth2!',
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}
