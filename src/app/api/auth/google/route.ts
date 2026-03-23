import { NextRequest, NextResponse } from "next/server";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";

export async function GET(request: NextRequest) {
  if (!CLIENT_ID) {
    return NextResponse.redirect(
      new URL("/login?error=google_not_configured", request.nextUrl.origin),
    );
  }

  const redirectTo = request.nextUrl.searchParams.get("redirect") ?? "/shop";
  const configuredRedirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI?.trim();
  const redirectUri =
    configuredRedirectUri ||
    `${request.nextUrl.origin}/api/auth/google/callback`;

  const state = Buffer.from(JSON.stringify({ redirect: redirectTo })).toString(
    "base64url",
  );

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: redirectUri,
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
