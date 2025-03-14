import { auth } from "@clerk/nextjs/server"; // ✅ Correct import
import { NextResponse } from "next/server";

export async function GET() {
  const authData = await auth(); // ✅ Await auth()
  const githubAccessToken = authData?.sessionClaims?.oauth_access_token;
    console.log(authData.getToken())
  if (!githubAccessToken) {
    return NextResponse.json({ error: "No GitHub token found" }, { status: 401 });
  }

  return NextResponse.json({ githubAccessToken });
}
