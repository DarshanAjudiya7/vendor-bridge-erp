import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { db } = await import("@/lib/db");
        const { users } = await import("@/lib/db/schema");
        const { eq } = await import("drizzle-orm");
        const bcrypt = await import("bcryptjs");

        const result = await db.select().from(users).where(eq(users.email, credentials.email as string));
        const user = result[0];

        if (!user) return null;

        // Verify password with bcrypt (fallback to direct compare for mock data in seed)
        let isPasswordValid = false;
        try {
          isPasswordValid = await bcrypt.compare(credentials.password as string, user.passwordHash);
        } catch (e) {
          // Ignore
        }
        
        if (!isPasswordValid && credentials.password !== user.passwordHash) {
          return null;
        }

        return { id: user.id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
