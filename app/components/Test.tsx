import { auth } from "@clerk/nextjs/server"; // ✅ Correct import
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionClaims } = auth(); // Get session claims
  const githubAccessToken = sessionClaims?.oauth_access_token;

  if (!githubAccessToken) {
    return NextResponse.json({ error: "No GitHub token found" }, { status: 401 });
  }

  return NextResponse.json({ githubAccessToken });
}
