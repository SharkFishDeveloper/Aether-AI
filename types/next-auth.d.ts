import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      username?: string | null; // GitHub Username
      image?: string | null; // GitHub Avatar URL,
      discordId?: string | null;
    };
  }

  interface JWT {
    accessToken?: string;
    username?: string;
    discordId?: string | null; 
  }

  interface Profile {
    id: number; // GitHub User ID (fixes the 'id' not found error)
    login: string; // GitHub Username
    avatar_url: string; // GitHub Profile Image
    discordId?: string | null;
  }
}
