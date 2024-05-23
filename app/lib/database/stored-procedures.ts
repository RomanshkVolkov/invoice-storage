import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const executeStoredProcedure = async (
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
  const result = await prisma.$queryRawUnsafe(query);

  return result;
};
