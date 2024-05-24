import prisma from '@/app/lib/database/prisma';

export async function getProviders() {
  return await prisma.providers.findMany();
}
