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
  confirmPassword: z.string(),
  type: z.coerce.string({
    message: 'Por favor, selecciona un tipo de usuario.',
  }),
  name: z
    .string({
      message: 'Nombre inválido.',
    })
    .min(1, {
      message: 'Por favor, ingresa un nombre.',
    }),
  rfc: z.string().refine((val) => val.length === 12 || val.length === 13, {
    message: 'El RFC debe tener 12 o 13 caracteres.',
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
  confirmPassword: true,
});

export function validateData(data: FormData) {
  return FormSchema.safeParse(Object.fromEntries(data));
}

export function validateUpdateData(data: FormData) {
  return UpdateProvider.safeParse(Object.fromEntries(data));
}

export function validatePasswords(data: FormData) {
  const { password, confirmPassword } = Object.fromEntries(data);
  if (password !== confirmPassword) {
    return {
      errors: {
        password: ['Las contraseñas no coinciden.'],
        name: undefined,
        rfc: undefined,
        zipcode: undefined,
        type: undefined,
        email: undefined,
      },
      message: 'Revisa los campos marcados en rojo.',
    };
  }
}

export async function checkExistingEmailAndRFC(
  provider: {
    rfc: string;
    id?: number;
  },
  user: {
    email: string;
    id?: number;
  }
) {
  try {
    const emailExist = await checkExistingUser(user.email, user.id);

    if (emailExist) {
      return {
        errors: {
          email: emailExist ? ['El correo ya está registrado.'] : undefined,
          name: undefined,
          rfc: undefined,
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
