import prisma from '@/app/lib/database/prisma';
import { Provider, User } from '../types';

export async function createProvider(
  provider: Omit<Provider, 'id' | 'user'>,
  user: Omit<User, 'id' | 'type'> & {
    userTypeID: number;
  }
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

export async function updateProvider(
  provider: Omit<Provider, 'user'> & {
    user: Omit<User, 'password' | 'type'> & { userTypeID: number };
  }
) {
  return await prisma.providers.update({
    where: {
      id: provider.id,
    },
    data: {
      name: provider.name,
      rfc: provider.rfc,
      zipcode: provider.zipcode,
      user: {
        update: {
          email: provider.user.email,
          userTypeID: provider.user.userTypeID,
        },
      },
    },
  });
}

export async function getProviders(userID: number) {
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
    where: {
      isDeleted: false,
      NOT: {
        user: {
          id: userID,
        },
      },
    },
  });

  return providers.map((provider) => ({
    ...provider,
    email: provider.user.email,
  }));
}

export async function getProviderByID(id: number) {
  const provider = await prisma.providers.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      rfc: true,
      name: true,
      zipcode: true,
      user: {
        select: {
          id: true,
          email: true,
          type: true,
          password: true,
        },
      },
    },
  });

  if (!provider) return null;

  return provider;
}

export async function checkExistingProvider(rfc: string, id?: number) {
  const provider = await prisma.providers.findFirst({
    where: {
      rfc,
      NOT: {
        id,
      },
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
