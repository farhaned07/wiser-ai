import { NextAuthConfig } from 'next-auth';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@/lib/db';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import Email from 'next-auth/providers/email';
import { compare } from 'bcrypt-ts';
import { getUserByEmail } from '@/lib/db/queries';

// Create a mock adapter when the database is not available
const getAdapter = () => {
  if (!db) {
    console.warn('Database not available, using JWT only');
    return undefined;
  }
  return DrizzleAdapter(db);
};

export const authConfig = {
  adapter: getAdapter(),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/error',
    verifyRequest: '/verify-request',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    Email({
      server: {
        host: process.env.EMAIL_SERVER_HOST || '',
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || '',
          pass: process.env.EMAIL_SERVER_PASSWORD || '',
        },
      },
      from: process.env.EMAIL_FROM || 'noreply@example.com',
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await getUserByEmail(credentials.email);

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id || '',
            email: user.email,
            name: user.name || user.email.split('@')[0],
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      return session;
    },
    async jwt({ token }) {
      return token;
    },
  },
} satisfies NextAuthConfig;
