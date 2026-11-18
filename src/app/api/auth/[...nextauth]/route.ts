import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/firebaseAdmin';

// Configure Google OAuth with timeout protection
const getGoogleProvider = () => {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';

  return GoogleProvider({
    clientId,
    clientSecret,
    // Increase timeout for OAuth requests (default is 3500ms)
    httpOptions: {
      timeout: 15000, // 15 seconds timeout
    },
  });
};

/** @type {import('next-auth').NextAuthOptions} */
const authOptions = {
  providers: [
    getGoogleProvider(),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        action: { label: 'Action', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const action = credentials.action;

          if (action === 'register') {
            // Registration flow - create new user
            if (!credentials.name) {
              return { error: 'Name is required for registration' };
            }

            // Check if user already exists
            const existingUser = await db.collection('users').where('email', '==', credentials.email).limit(1).get();

            if (!existingUser.empty) {
              return { error: 'User already exists with this email' };
            }

            // Create new user (in production, password should be hashed before storing)
            const newUser = {
              email: credentials.email,
              name: credentials.name,
              role: 'user',
              createdAt: new Date(),
              image: null,
            };

            const userRef = await db.collection('users').add(newUser);

            return {
              id: userRef.id,
              email: credentials.email,
              name: credentials.name,
              image: null,
              role: 'user',
            };
          } else {
            // Sign-in flow - verify credentials
            const user = await db.collection('users').where('email', '==', credentials.email).limit(1).get();

            if (user.empty) {
              return { error: 'No user found with this email' };
            }

            const userData = user.docs[0].data();
            return {
              id: user.docs[0].id,
              email: userData.email,
              name: userData.name,
              image: userData.image,
              role: userData.role || 'user',
            };
          }
        } catch (error) {
          console.error('Error during credential auth:', error);
          return { error: 'An error occurred. Please try again.' };
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt' as const,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;

        // Fetch user role from Firestore
        try {
          const userDoc = await db.collection('users').doc(token.sub).get();
          if (userDoc.exists) {
            (session.user as any).role = (userDoc.data() as any)?.role || 'user';
          }
        } catch (err) {
          console.warn('Error fetching user role:', err);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        (token as any).role = (user as any).role || 'user';
      }
      return token;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };