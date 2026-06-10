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
        // Mock authorization for now
        if (credentials?.email === "admin@vendorbridge.com" && credentials?.password === "admin") {
          return { id: "1", name: "Admin User", email: "admin@vendorbridge.com", role: "ADMIN" };
        }
        if (credentials?.email === "procurement@vendorbridge.com" && credentials?.password === "procurement") {
          return { id: "2", name: "Procurement Officer", email: "procurement@vendorbridge.com", role: "PROCUREMENT_OFFICER" };
        }
        if (credentials?.email === "manager@vendorbridge.com" && credentials?.password === "manager") {
          return { id: "3", name: "Manager User", email: "manager@vendorbridge.com", role: "MANAGER" };
        }
        if (credentials?.email === "vendor@vendorbridge.com" && credentials?.password === "vendor") {
          return { id: "4", name: "Vendor User", email: "vendor@vendorbridge.com", role: "VENDOR" };
        }
        return null;
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
