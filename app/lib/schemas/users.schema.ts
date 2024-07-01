import { z } from 'zod';

export const FormSchema = z.object({
  name: z
    .string({
      message: 'Nombre inválido.',
    })
    .min(3, {
      message: 'Por favor, ingresa un nombre.',
    }),
  email: z.string().email({
    message: 'Por favor, ingresa un correo válido.',
  }),
  username: z.string().min(4, {
    message: 'Por favor, ingresa un nombre de usuario.',
  }),
  userTypeID: z.string().refine((value) => !isNaN(Number(value)), {
    message: 'Por favor, selecciona un tipo de usuario.',
  }),
  isActive: z.string().optional(),
  password: z.string().min(6, {
    message: 'Por favor, ingresa una contraseña de al menos 6 caracteres.',
  }),
});

export interface Errors {
  username?: string[] | undefined;
  name?: string[] | undefined;
  email?: string[] | undefined;
  userTypeID?: string[] | undefined;
  isActive?: string[] | undefined;
  password?: string[] | undefined;
}
