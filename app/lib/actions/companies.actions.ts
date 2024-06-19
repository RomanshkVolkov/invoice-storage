'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import {
  crudDeleteCompany,
  crudUpdateCompany,
  crudCreateCompany,
  getCompanyByRFC,
} from '../database/companies';

const BaseFormSchema = z.object({
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
});

const EmailSchema = z.record(
  z.string().regex(/^email-\d+$/, 'Formato de clave de email inválido'),
  z
    .string()
    .email({ message: 'Por favor, ingresa un correo válido.' })
    .nullable()
);

export async function createCompany(prevState: any, data: FormData) {
  // Convertir FormData a un objeto
  const formDataObj = Object.fromEntries(data);

  const baseValidation = BaseFormSchema.safeParse(formDataObj);
  if (!baseValidation.success) {
    return {
      errors: baseValidation.error.flatten().fieldErrors,
      message: 'Por favor, revisa los campos marcados en rojo.',
    };
  }

  // Filtrar y validar correos electrónicos
  const emailEntries = Object.entries(formDataObj).filter(([key]) =>
    key.startsWith('email-')
  );

  const emailObj = Object.fromEntries(emailEntries);
  const emailValidation = EmailSchema.safeParse(emailObj);

  if (!emailValidation.success) {
    return {
      errors: emailValidation.error.flatten().fieldErrors,
      message: 'Por favor, revisa los campos marcados en rojo.',
    };
  }

  const emails = Object.values(emailValidation.data).join(';');

  const company = {
    ...baseValidation.data,
    rfc: baseValidation.data.rfc.toUpperCase(),
    emails: emails || null,
  };

  const existingCompany = await getCompanyByRFC(company.rfc);
  if (existingCompany) {
    return {
      errors: {
        rfc: ['El RFC ya está registrado.'],
        name: undefined,
        prefix: undefined,
      },
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  try {
    await crudCreateCompany(company);
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message:
        'Ha ocurrido un error inesperado, por favor, contacta a soporte.',
    };
  }

  revalidatePath('/dashboard/companies');
  redirect('/dashboard/companies');
}

export async function editCompany(
  companyID: number,
  prevState: any,
  data: FormData
) {
  // Convertir FormData a un objeto
  const formDataObj = Object.fromEntries(data);

  // Validar campos fijos
  const baseValidation = BaseFormSchema.safeParse(formDataObj);
  if (!baseValidation.success) {
    return {
      errors: baseValidation.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  // Filtrar y validar correos electrónicos
  const emailEntries = Object.entries(formDataObj).filter(([key]) =>
    key.startsWith('email-')
  );

  const emailObj = Object.fromEntries(emailEntries);
  const emailValidation = EmailSchema.safeParse(emailObj);

  if (!emailValidation.success) {
    return {
      errors: emailValidation.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  const emails = Object.values(emailValidation.data).join(';');

  const company = {
    ...baseValidation.data,
    rfc: baseValidation.data.rfc.toUpperCase(),
    emails: emails || null,
  };

  const existingCompany = await getCompanyByRFC(company.rfc, companyID);
  if (existingCompany) {
    return {
      errors: {
        rfc: ['El RFC ya está registrado.'],
        name: undefined,
        prefix: undefined,
      },
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  try {
    await crudUpdateCompany(companyID, company);
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message:
        'Ha ocurrido un error inesperado, por favor, contacta a soporte.',
    };
  }

  revalidatePath('/dashboard/companies');
  redirect('/dashboard/companies');
}

export async function deleteCompany(id: number) {
  try {
    await crudDeleteCompany(id);
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      message:
        'Ha ocurrido un error al eliminar la empresa, por favor, contacta a soporte.',
    };
  }
  revalidatePath('/dashboard/companies');
}
