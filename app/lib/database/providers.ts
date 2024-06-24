import prisma from '@/app/lib/database/prisma';
import { Providers } from '@prisma/client';
import { Provider, User } from '../types';

const ITEMS_PER_PAGE = 5;

export async function createProvider(
  provider: Omit<Providers, 'id'>,
  users: number[]
) {
  return await prisma.$transaction(async (ctx) => {
    const isExistProvider = await ctx.providers.findUnique({
      where: {
        rfc: provider.rfc,
      },
    });

    if (isExistProvider) {
      throw new Error('El proveedor ya existe en la base de datos.');
    }

    const newProvider = await ctx.providers.create({
      data: {
        ...provider,
        users: {
          connect: users.map((id) => ({ id })),
        },
      },
    });
  });
}

export async function updateProvider(
  provider: Omit<Providers, 'user'> & {
    users: number[];
  }
) {
  return await prisma.providers.update({
    where: {
      id: provider.id,
    },
    data: {
      ...provider,
      users: {
        connect: {
          id: provider.users.map((id) => id),
        },
      },
    },
  });
}

export async function getProviders(userID: number) {
  const providers = await prisma.userProviders.findMany({
    include: {
      provider: {
        select: {
          id: true,
          rfc: true,
          name: true,
          zipcode: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          type: true,
        },
      },
    },

    where: {
      user: {
        isActive: true,
      },
    },
  });

  return await Promise.all(
    providers.map(async (provider) => {
      const user = await prisma.userProviders.findFirst({
        where: {
          providerID: provider.id,
        },
        select: {
          provider: {},
        },
      });
      if (!user) {
        throw new Error('Corrupted data. User not found.');
      }
      return { ...provider, email: user!.email, user };
    })
  );
}

export async function getProvidersPages(userID: number) {
  const count = await prisma.providers.count({
    where: {
      isDeleted: false,
      NOT: {
        users: {
          some: {
            id: userID,
            isActive: true,
          },
        },
      },
    },
  });
  return Math.ceil(count / ITEMS_PER_PAGE);
}

export async function getProviderByID(id: number, userID: number) {
  if (!id || !userID) return null;
  const provider = await prisma.providers.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      rfc: true,
      name: true,
      zipcode: true,
    },
  });
  const user = await prisma.users.findUnique({
    where: {
      id: userID,
    },
    select: {
      id: true,
      email: true,
      type: true,
      password: true,
    },
  });

  if (!provider || !user) return null;

  return { ...provider, user };
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

export async function deleteProvider(id: number, userID: number) {
  return await prisma.$transaction(async (ctx) => {
    const userDisabled = await ctx.users.update({
      data: {
        isActive: false,
      },
      where: {
        id: userID,
      },
    });
    if (!userDisabled.id) {
      throw new Error('Failed to disable user');
    }
    // isDeleted is set to true when all users related are disabled
    await ctx.providers.update({
      data: {
        isDeleted: true,
      },
      where: {
        id,
        users: {
          every: {
            isActive: false,
          },
        },
      },
    });
  });
}
