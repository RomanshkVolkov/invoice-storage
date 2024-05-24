import prisma from '@/app/lib/database/prisma';
import { serializedDB } from '../serializers/parser';

export const executeStoredProcedure = async <T>(
  procedure: string,
  params: any
) => {
  const serializedParams = Object.keys(params)
    .map((key) => {
      const value = params[key];
      const param = typeof value === 'string' ? `'${value}'` : value;
      return `@${key} = ${param}`;
    })
    .join(', ');

  const schema = process.env.DB_SCHEMA || 'invoice_storage';
  const query = `EXEC ${schema}.${procedure} ${serializedParams}`;
  const result = await prisma.$queryRawUnsafe<T[]>(query);

  if (result.length === 1) {
    return serializedDB(result);
  }
  return result;
};

export const db = prisma;
