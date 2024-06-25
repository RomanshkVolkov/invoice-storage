import prisma from '@/app/lib/database/prisma';
import { auth } from '@/auth';
import { Users } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function getProviderUsers() {
  const users = await prisma.users.findMany({
    where: {
      isActive: true,
      isDeleted: false,
      userTypeID: 2, // provider
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return users;
}

export async function getUsers(): Promise<
  (Pick<Users, 'id' | 'name' | 'username' | 'email'> & {
    type: {
      id: number;
      name: string;
    };
  })[]
> {
  const session = await auth();
  if (!session) {
    return [];
  }

  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      type: true,
    },
    where: {
      isDeleted: false,
      id: {
        notIn: [+(session!.user!.id! || 0)],
      },
    },
  });
  return users || [];
}

export async function getUserByID(id: number) {
  const user = await prisma.users.findUnique({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      type: true,
      isActive: true,
    },
    where: {
      id,
      isDeleted: false,
    },
  });
  return user;
}

export async function login(username: string) {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      password: true,
      type: true,
      providers: {
        select: {
          providers: {
            select: {
              id: true,
              name: true,
              rfc: true,
            },
          },
        },
      },
    },
    where: {
      username,
      isActive: true,
      isDeleted: false,
    },
  });
  if (!user) {
    return null;
  }

  return {
    ...user,
    providers: user?.providers.map((provider) => provider.providers),
  };
}

export async function findUserByUsername(username: string) {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      isActive: true,
    },
    where: {
      username,
      isDeleted: false,
    },
  });
  return user;
}

export async function getUserTypes() {
  const userTypes = await prisma.userTypes.findMany();
  return userTypes;
}

export async function checkExistingUser(username: string, id?: number) {
  const user = await prisma.users.findFirst({
    where: {
      username,
      NOT: {
        id,
      },
    },
  });
  return !!user;
}
export async function createUser(
  user: Omit<Users, 'id' | 'otp' | 'otpExpireDate' | 'isDeleted'>
) {
  return await prisma.users.create({
    data: user,
  });
}

export async function updateUserByID(
  user: Omit<Users, 'otp' | 'otpExpireDate' | 'password' | 'isDeleted'>
) {
  return await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      name: user.name,
      username: user.username,
      email: user.email,
    },
  });
}

export async function updateUserOTP(user: Partial<Users>) {
  return await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      otp: user.otp,
      otpExpireDate: user.otpExpireDate,
    },
  });
}

export async function deleteUserByID(id: number) {
  const result = {
    message: '',
  };
  const deletedUser = await prisma.users.update({
    where: {
      id,
    },
    data: {
      isActive: false,
      isDeleted: true,
    },
  });
  if (deletedUser.isActive) {
    result.message = `No se pudo eliminar el usuario ${deletedUser.name}.`;
    return result;
  }

  result.message = `Se elimino el usuario ${deletedUser.name} correntamente.`;
  revalidatePath('/dashboard/users');
  return result;
}
