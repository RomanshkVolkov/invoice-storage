import prisma from '@/app/lib/database/prisma';

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

export async function getUserTypes() {
  const userTypes = await prisma.userTypes.findMany();
  return userTypes;
}

export async function checkExistingUser(email: string) {
  const user = await prisma.users.findFirst({
    where: {
      email,
    },
  });
  return !!user;
}
export async function createUser(user: {
  email: string;
  password: string;
  userTypeID: number;
}) {
  return await prisma.users.create({
    data: user,
  });
}
