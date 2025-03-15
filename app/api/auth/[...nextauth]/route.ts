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
  secret: process.env.NEXTAUTH_SECRET || "asfasfasfasff", 

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
    
    async signIn({ account,profile }) {
      console.log("Account details:", account);
      if (!account?.access_token) {
        console.error("No access token found");
        return false;
      }

      try {
        const installations = await fetch("https://api.github.com/user/installations", {
          method: "GET",
          headers: {
            Authorization: `token ${account.access_token}`,
            Accept: "application/vnd.github.v3+json",
          },
        }).then((res) => res.json());
        
        // Add user in DB here
        if (!installations.installations || installations.installations.length === 0) {
          console.log("No apps installed");
          return `https://github.com/apps/Aether-server/installations/new`;
        }
      } catch (error) {
        console.error("Error fetching installations:", error);
        return false;
      }
      if (profile) {
        await prisma.user.upsert({
          where: { email: profile.email },
          update: { 
            name: profile.name, 
            githubId: profile.id.toString(),
            avatar: profile.avatar_url 
          },
          create: {
            name: profile.name,
            email: profile.email,
            githubId: profile.id.toString(),
            avatar: profile.avatar_url,
          },
        });
      }
      return true;
    },
   
  },
};

const handler = NextAuth(authOptions);
export { handler as POST, handler as GET };


// async redirect({ url, baseUrl }) {
//   try {
//     const cleanedUrl = new URL(url, baseUrl);
//     cleanedUrl.search = ""; // Removes query params
//     return cleanedUrl.toString();
//   } catch (error) {
//     console.error("Redirect error:", error);
//     return baseUrl;
//   }
// },
// cookies: {
//   pkceCodeVerifier: {
//     name: 'next-auth.pkce.code_verifier',
//     options: {
//       httpOnly: true,
//       sameSite: 'none',
//       path: '/',
//       secure: process.env.NODE_ENV === 'production',
//     },
//   },

// },