import { z } from 'zod';
import { checkExistingProvider } from '../database/providers';
import { checkExistingUser } from '../database/user';

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

const UpdateProvider = FormSchema.omit({
  password: true,
});

export async function validateData(data: FormData) {
  return FormSchema.safeParse(Object.fromEntries(data));
}

export async function validateUpdateData(data: FormData) {
  return UpdateProvider.safeParse(Object.fromEntries(data));
}

export async function checkExistingEmailAndRFC(
  provider: {
    email: string;
    id?: number;
  },
  user: {
    rfc: string;
    id?: number;
  }
) {
  try {
    const isEmailRegistered = await checkExistingUser(
      provider.email,
      provider.id
    );
    const isProviderRegistered = await checkExistingProvider(user.rfc, user.id);
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
}
