import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;  // Store accessToken directly in the session
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      githubId?: string | null; 
      avatar?: string | null; 
    };
  }

  interface JWT {
    accessToken?: string; 
  }
}
