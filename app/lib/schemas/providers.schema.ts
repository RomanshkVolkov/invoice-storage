import { z } from 'zod';

export const FormSchema = z.object({
  email: z.string().email({
    message: 'Por favor, ingresa un correo válido.',
  }),
  name: z
    .string({
      message: 'Nombre inválido.',
    })
    .min(3, {
      message: 'Por favor, ingresa un nombre.',
    }),
  rfc: z.string().refine((val) => val.length === 12 || val.length === 13, {
    message: 'El RFC debe tener 12 o 13 caracteres.',
  }),
  zipcode: z.coerce
    .number({
      message: 'El código postal debe ser un número.',
    })
    .nullable(),
  assignedUsers: z.array(z.number()),
});

export interface Errors {
  rfc?: string[] | undefined;
  name?: string[] | undefined;
  zipcode?: string[] | undefined;
  email?: string[] | undefined;
  assignedUsers?: string[] | undefined;
}
