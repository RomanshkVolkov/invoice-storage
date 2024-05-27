import prisma from '@/app/lib/database/prisma';

interface Provider {
  id: number;
  rfc: string;
  name: string;
  zipcode: number | null;
}

interface User {
  id: number;
  email: string;
  password: string;
  userTypeID: number;
}

export async function createProvider(
  provider: Omit<Provider, 'id'>,
  user: Omit<User, 'id'>
) {
  return await prisma.$transaction(async (context) => {
    const userCreated = await context.users.create({
      data: user,
    });

    const providerCreated = await context.providers.create({
      data: {
        ...provider,
        userID: userCreated.id,
      },
    });

    return providerCreated;
  });
}

export async function getProviders() {
  const providers = await prisma.providers.findMany({
    select: {
      id: true,
      rfc: true,
      name: true,
      zipcode: true,
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  // Removes the user object from the provider object and adds the email property
  return providers.map(({ user, ...rest }) => ({
    ...rest,
    email: user.email,
  }));
}

export async function checkExistingProvider(rfc: string) {
  const provider = await prisma.providers.findFirst({
    where: {
      rfc,
    },
  });
  return !!provider;
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
