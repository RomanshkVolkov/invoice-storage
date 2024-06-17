import prisma from '@/app/lib/database/prisma';
import { Users } from '@prisma/client';

export async function login(email: string) {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      email: true,
      password: true,
      type: true,
      provider: {
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

export async function findUserByEmail(email: string) {
  const user = await prisma.users.findFirst({
    select: {
      id: true,
      email: true,
      type: true,
      provider: {
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

export async function getUserTypes() {
  const userTypes = await prisma.userTypes.findMany();
  return userTypes;
}

export async function checkExistingUser(email: string, id?: number) {
  const user = await prisma.users.findFirst({
    where: {
      email,
      NOT: {
        id,
      },
      AND: {
        provider: {
          isDeleted: false,
        },
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
