import prisma from '@/app/lib/database/prisma';

export async function getUserTypes() {
  return await prisma.userTypes.findMany();
}
