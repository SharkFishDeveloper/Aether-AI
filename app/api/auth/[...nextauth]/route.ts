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
  secret: "asfasfasfasff", // Required for security
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.accessToken = account.access_token;
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
    
    async signIn({ account }) {
      // const router = useRouter();
      console.log("Account details:", account); 
      if (!account?.access_token) return false; 
      const installations = await fetch("https://api.github.com/user/installations", {
        headers: {
          Authorization: `token ${account.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }).then((res) => res.json());

      if (!installations.installations || installations.installations.length === 0) {
        console.log("❌ No installations found! Redirecting user to install GitHub App.");
        return `https://github.com/apps/Aether-server/installations/new
    `
      
      }

      return true; // Allow sign-in if the GitHub App is installed
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as POST, handler as GET };


// ?redirect_uri=${encodeURIComponent(
//     process.env.NEXTAUTH_URL + "/auth/callback/github?installed=true"
//   )};