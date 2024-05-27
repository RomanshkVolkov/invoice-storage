import prisma from '@/app/lib/database/prisma';

export async function getProviders() {
  return await prisma.providers.findMany();
}

export async function deleteProvider(id: number) {
  return await prisma.providers.update({
    data: {
      isDeleted: true,
    },
    where: {
      id,
    },
  });
}
