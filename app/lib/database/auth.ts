import prisma from '@/app/lib/database/prisma';

export async function login(email: string, password: string) {
  const user = prisma.users.findFirst({
    where: {
      email,
    },
  });
  console.log(user);
  return user;
}
