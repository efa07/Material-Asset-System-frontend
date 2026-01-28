import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ url: process.env.NEXTAUTH_URL ?? "/" });
  }

  const issuer = process.env.KEYCLOAK_ISSUER;
  const idToken = token.idToken as string;
  // Use NEXTAUTH_URL as the redirect URI, or fallback to request origin
  const origin = req.nextUrl.origin;
  const postLogoutRedirectUri = process.env.NEXTAUTH_URL ?? origin;

  let url = `${issuer}/protocol/openid-connect/logout`;
  
  if (idToken) {
      url += `?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}&id_token_hint=${idToken}`;
  } else {
      url += `?post_logout_redirect_uri=${encodeURIComponent(postLogoutRedirectUri)}`;
  }

  return NextResponse.json({ url });
}
