import { PrismaClient } from '@prisma/client';
import { serializedDB } from '../serializers/parser';

const prisma = new PrismaClient();

export const executeStoredProcedure = async <T>(
  procedure: string,
  params: any
) => {
  const serializedParams = Object.keys(params)
    .map((key) => {
      const param = params[key];
      if (typeof param === 'string') {
        return `@${key} = '${param}'`;
      }
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
