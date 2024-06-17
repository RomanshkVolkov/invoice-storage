'use server';

import { crudDeleteCompany } from '../database/companies';

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
