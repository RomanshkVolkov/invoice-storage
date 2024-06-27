import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'Outlook365',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
