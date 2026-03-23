import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirect") ?? "/shop";

  const state = Buffer.from(JSON.stringify({ redirect: redirectTo })).toString(
    "base64url",
  );

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: `${APP_URL}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state,
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
}
