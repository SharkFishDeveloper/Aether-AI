import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      username?: string | null; // GitHub Username
      image?: string | null; // GitHub Avatar URL
    };
  }

  interface JWT {
    accessToken?: string;
    username?: string;
  }

  interface Profile {
    id: number; // GitHub User ID (fixes the 'id' not found error)
    login: string; // GitHub Username
    avatar_url: string; // GitHub Profile Image
  }
}
