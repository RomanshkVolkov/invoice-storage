import prisma from '@/app/lib/database/prisma';
import { excludeFields } from '../serializers/prisma';

export async function login(email: string, password: string) {
  const user = await prisma.users.findFirst({
    where: {
      email,
    },
    include: { userTypes: true, providers: true },
  });
  return excludeFields(user, ['userTypeID']);
}
