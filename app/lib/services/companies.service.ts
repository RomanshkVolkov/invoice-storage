import { z } from 'zod';
import { getCompanyByRFC } from '../database/companies';

const FormSchema = z.object({
  rfc: z.string().length(12, {
    message: 'El RFC debe tener 12 caracteres.',
  }),
  name: z
    .string({
      message: 'Nombre inválido.',
    })
    .min(1, {
      message: 'Por favor, ingresa un nombre.',
    }),
  prefix: z.string().nullable(),
  emails: z.string().nullable(),
});

export function validateCrateData(data: FormData) {
  return FormSchema.safeParse(Object.fromEntries(data));
}

export async function checkExistingCompany(rfc: string, id?: number) {
  try {
    const isCompanyRegistered = await getCompanyByRFC(rfc, id);

    if (isCompanyRegistered) {
      return {
        errors: {
          rfc: ['El RFC ya está registrado.'],
          name: undefined,
          prefix: undefined,
          emails: undefined,
        },
        message: 'Revisa los campos marcados en rojo.',
      };
    }
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message:
        'Ha ocurrido un error al verificar el RFC, por favor, intenta de nuevo.',
    };
  }
}
