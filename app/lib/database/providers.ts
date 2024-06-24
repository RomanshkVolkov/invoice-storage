import prisma from '@/app/lib/database/prisma';
import { Provider, User } from '../types';

const ITEMS_PER_PAGE = 5;

export async function createProvider(
  provider: Omit<Provider, 'id' | 'user'>,
  user: Omit<User, 'id' | 'type'> & {
    userTypeID: number;
  }
) {
  return await prisma.$transaction(async (context) => {
    const existingProvider = await context.providers.findUnique({
      where: {
        rfc: provider.rfc,
      },
    });

    if (!existingProvider) {
      const providerCreated = await context.providers.create({
        data: {
          ...provider,
        },
      });
      const userCreated = await context.users.create({
        data: { ...user, providerID: providerCreated.id },
      });
      return {
        user: userCreated,
        provider: providerCreated,
      };
    }

    await context.providers.update({
      where: {
        id: existingProvider.id,
      },
      data: {
        isDeleted: false,
      },
    }); // reactivate provider

    const userCreated = await context.users.create({
      data: { ...user, providerID: existingProvider.id },
    });

    return {
      user: userCreated,
      provider: existingProvider,
    };
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
      users: {
        update: {
          where: {
            id: provider.user.id,
          },
          data: {
            email: provider.user.email,
            userTypeID: provider.user.userTypeID,
          },
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
    },
    where: {
      isDeleted: false,
      NOT: {
        users: {
          some: {
            id: userID,
          },
        },
      },
    },
  });

  return await Promise.all(
    providers.map(async (provider) => {
      const user = await prisma.users.findFirst({
        where: {
          providerID: provider.id,
        },
        select: {
          id: true,
          email: true,
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
