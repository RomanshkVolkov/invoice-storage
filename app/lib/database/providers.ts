import prisma from '@/app/lib/database/prisma';
import { Providers } from '@prisma/client';

const ITEMS_PER_PAGE = 5;

export async function createProvider(
  provider: Omit<Providers, 'id' | 'isDeleted'>,
  users: number[]
) {
  return await prisma.$transaction(async (ctx) => {
    const newProvider = await ctx.providers.create({
      data: {
        ...provider,
      },
    });

    const connectUsers = await ctx.userProviders.createMany({
      data: users.map((id) => ({
        userID: id,
        providerID: newProvider.id,
      })),
    });

    return {
      provider: newProvider,
      users: connectUsers,
    };
  });
}

export async function updateProvider(
  provider: Omit<Providers, 'user' | 'isDeleted'>,
  users: number[]
) {
  return await prisma.$transaction(async (ctx) => {
    // eslint-disable-next-line no-unused-vars
    const { id, ...rest } = provider;
    const updatedProvider = await ctx.providers.update({
      where: {
        id: provider.id,
      },
      data: rest,
    });

    const deletedRelatedUsers = await ctx.userProviders.deleteMany({
      where: {
        providerID: provider.id,
        userID: {
          notIn: users,
        },
      },
    });

    const createdRelatedUsers = await ctx.userProviders.createMany({
      data: users.map((id) => ({
        userID: id,
        providerID: provider.id,
      })),
    });

    return {
      provider: updatedProvider,
      users: { deleted: deletedRelatedUsers, created: createdRelatedUsers },
    };
  });
}

export async function getProviders() {
  const providers = await prisma.providers.findMany({
    select: {
      id: true,
      rfc: true,
      name: true,
      email: true,
      zipcode: true,
    },
    where: {
      isDeleted: false,
    },
  });

  return providers;
}

export async function getProvidersPages() {
  const count = await prisma.providers.count({
    where: {
      isDeleted: false,
    },
  });
  return Math.ceil(count / ITEMS_PER_PAGE);
}

export async function getProviderByID(id: number) {
  if (!id) return null;
  const provider = await prisma.providers.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      rfc: true,
      zipcode: true,
      users: {
        select: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      invoices: {
        select: {
          id: true,
        },
        where: {
          NOT: {
            isDeleted: true,
          },
        },
      },
    },
  });

  if (!provider) return null;

  return {
    ...provider,
    users: provider.users.map((user) => user.users),
  };
}

export async function checkExistingProvider(rfc: string, id?: number) {
  const provider = await prisma.providers.findUnique({
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
  return await prisma.$transaction(
    async (ctx) =>
      await ctx.providers.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      })
  );
}
