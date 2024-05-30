'use server';

import { AuthError } from 'next-auth';
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import { signIn } from '@/auth';

const CLIENT_ID =
  '588536859750-62ehkc9vam0rqh2qm5tclrtnfigk1fp5.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI =
  '588536859750-62ehkc9vam0rqh2qm5tclrtnfigk1fp5.apps.googleusercontent.com';
const REFRESH_TOKEN =
  '1//04oSwX6szf1rGCgYIARAAGAQSNwF-L9IrTUHbseYD3v2LayUCGdLYFDmJGq2F90ZhxI0TASsBqXaHgp0TY4Jo8iWrB35Usiy905E';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

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
    await sendEmail();
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
    const accessToken = await oAuth2Client.getAccessToken();
    if (accessToken.token === null) {
      throw new Error('Failed to retrieve access token');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'diegogutcat28@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    const mailOptions = {
      from: 'diego.catzin@outlook.com',
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
