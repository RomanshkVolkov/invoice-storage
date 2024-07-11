import nodemailer from 'nodemailer';

/*
INVOICE-STORAGE.COM
----------------------------------------------
correo: noreply@invoice-storage.com
password: D?kd3q018


Configuración manual
Nombre de usuario de servidor de correo
noreply@invoice-storage.com

Servidor de correo entrante
invoice-storage.com

Servidor de correo saliente
invoice-storage.com
(el servidor requiere autenticación)

Protocolos de correo entrante soportados
POP3, POP3 over SSL/TLS, IMAP, IMAP over SSL/TLS

Protocolos de correo saliente soportados
SMTP

Para conectarse mediante POP3 de forma segura a través de SSL/TLS, use el puerto 995.

Para conectarse mediante IMAP de forma segura a través de SSL/TLS, use el puerto 993.

Para enviar mensajes mediante SMTP de forma segura, use el puerto 465.*/

export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
