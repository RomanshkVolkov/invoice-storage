import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;

      const isOnRoot = nextUrl.pathname === '/';
      const isAdmin = auth?.user?.image === 'Admin';
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnProviders = nextUrl.pathname.startsWith('/dashboard/providers');

      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        if (isOnProviders && !isAdmin)
          return Response.redirect(new URL('/dashboard', nextUrl));
        return true;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      } else if (isOnRoot) {
        return Response.redirect(new URL('/login', nextUrl));
      }
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
