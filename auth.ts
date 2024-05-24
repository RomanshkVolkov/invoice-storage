import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { login } from './app/lib/database/user';

declare module 'next-auth' {
  interface User {
    type: {
      id: number;
      name: string;
    };
    provider: {
      id: number;
      name: string;
      rfc: string;
    } | null;
    givenName?: string | null;
    preferLanguage?: string | null;
  }
}

async function getUser(email: string) {
  try {
    const user = await login(email);
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
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as unknown as string,
        email: token.email ?? '',
        type: token.type as unknown as { id: number; name: string },
        provider: token.provider as unknown as {
          id: number;
          name: string;
          rfc: string;
        } | null,
      };

      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.type = user.type;
        token.provider = user.provider;
      }
      return token;
    },
  },
});
