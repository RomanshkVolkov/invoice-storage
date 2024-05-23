import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { User } from './app/lib/types';
import { executeStoredProcedure } from './app/lib/database/stored-procedures';

async function getUser(email: string): Promise<User | null> {
  try {
    const data = await executeStoredProcedure<User>('sp_web_login', {
      email: 'root@dwit.com',
    });

    const user = data[0];

    if (!user) return null;
    return user;
  } catch (error) {
    console.error('Failed to fetch user: ', error);
    throw new Error('Failed to fetch user');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { email, password } = parsedCredentials.data;
        const user = await getUser(email);
        if (!user) return null;

        const paswordsMatch = await bcrypt.compare(password, user.password);

        if (!paswordsMatch) {
          console.log('Passwords do not match');
          return null;
        }

        const userWithStringId = { ...user, id: user.id.toString() };

        return userWithStringId;
      },
    }),
  ],
});
