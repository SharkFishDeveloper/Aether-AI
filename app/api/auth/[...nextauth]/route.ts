import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: { scope: "repo read:user" }, // Needed for private repos
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Required for security
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

// ✅ FIX: Named exports for GET and POST (App Router requirement)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
