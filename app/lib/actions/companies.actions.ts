'use server';

import { revalidatePath } from 'next/cache';
import { crudCreateCompany, crudDeleteCompany } from '../database/companies';
import {
  checkExistingCompany,
  validateCrateData,
} from '../services/companies.service';
import { redirect } from 'next/navigation';

export async function createCompany(prevState: any, formData: FormData) {
  const validatedData = validateCrateData(formData);

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      message: 'Revisa los campos marcados en rojo.',
    };
  }

  const company = {
    rfc: validatedData.data.rfc.toUpperCase(),
    name: validatedData.data.name,
    prefix: validatedData.data.prefix,
    emails: validatedData.data.emails,
  };

  const existingCompany = await checkExistingCompany(company.rfc);
  if (existingCompany) return existingCompany;

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
}
