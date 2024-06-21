import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;

      const isOnRoot = nextUrl.pathname === '/';
      const isAdmin = auth?.user?.image === 'Admin';
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      const isOnProviders = nextUrl.pathname.startsWith('/dashboard/providers');
      const isOnCompanies = nextUrl.pathname.startsWith('/dashboard/companies');

      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        if ((isOnProviders || isOnCompanies) && !isAdmin) {
          return Response.redirect(new URL('/dashboard', nextUrl));
        }
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
  trustHost: true,
} satisfies NextAuthConfig;
