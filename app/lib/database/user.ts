import prisma from '@/app/lib/database/prisma';
import { Users } from '@prisma/client';

export async function getProviderUsers() {
  const users = await prisma.users.findMany({
    where: {
      isActive: true,
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

/*export async function getUsers() {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
    where: {
      isActive: true,
    },
  });
  return users;
}*/

export async function login(username: string) {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      email: true,
      password: true,
      type: true,
      name: true,
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
    },
  });
  return user;
}

export async function findUserByUsername(username: string) {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      username: true,
      email: true,
      type: true,
    },
    where: {
      username,
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
  user: Required<Omit<Users, 'id' | 'otp' | 'otpExpireDate'>>
) {
  return await prisma.users.create({
    data: user,
  });
}

export async function updateUser(user: Omit<Users, 'type' | 'password'>) {
  return await prisma.users.update({
    where: {
      id: user.id,
    },
    data: {
      email: user.email,
      userTypeID: user.userTypeID,
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
