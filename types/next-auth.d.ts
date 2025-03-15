import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string | null; // GitHub Username
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
