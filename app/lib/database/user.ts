import prisma from '@/app/lib/database/prisma';
import { excludeFields } from '../serializers/prisma';

export async function login(email: string, password: string) {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      email: true,
      password: true,
      userTypes: true,
      providers: {
        select: {
          id: true,
          name: true,
          rfc: true,
        },
      },
    },
    where: {
      email,
    },
  });
  return user;
}

export async function createUser(user: any, provider?: any) {
  await prisma.$transaction(async (context) => {
    await context.users.create({
      data: user,
    });
    if (!provider) return;
    await context.providers.create({
      data: provider,
    });
  });
}
