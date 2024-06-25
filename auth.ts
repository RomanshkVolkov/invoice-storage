import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { login } from './app/lib/database/user';

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface User {
    type: {
      id: number;
      name: string;
    };
    providers:
      | {
          id: number;
          name: string;
          rfc: string;
        }[]
      | null;
    givenName?: string | null;
    preferLanguage?: string | null;
  }
}

async function getUser(username: string) {
  try {
    const user = await login(username);
    if (!user) return null;
    return {
      ...user,
      providers: user.providers.map((provider) => provider.providers),
    };
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
            username: z.string(),
            password: z.string().min(6),
          })
          .safeParse(credentials);
        if (!parsedCredentials.success) return null;
        const { username, password } = parsedCredentials.data;
        const user = await getUser(username);
        if (!user) return null;

        const paswordsMatch = await bcrypt.compare(password, user.password);
        if (!paswordsMatch) {
          console.error('Passwords do not match');
          return null;
        }

        const userWithStringId = { ...user, id: user.id.toString() };

        return userWithStringId;
      },
    }),
  ],
  trustHost: true,
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.type = user.type;
        token.providers = user.providers;
        token.picture = user.type.name;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as unknown as string,
        email: token.email ?? '',
        type: token.type as unknown as { id: number; name: string },
        providers: token.providers as unknown as
          | {
              id: number;
              name: string;
              rfc: string;
            }[]
          | null,
      };
      return session;
    },
  },
});
