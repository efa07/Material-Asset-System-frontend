import { NextAuthOptions, TokenSet } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";

function requestRefreshOfAccessToken(token: JWT) {
  return fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.KEYCLOAK_CLIENT_ID ?? "",
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
      refresh_token: token.refreshToken ?? "",
    }),
    method: "POST",
  })
    .then(async (response) => {
        const tokens: TokenSet = await response.json();
        
        if (!response.ok) throw tokens;

        return {
            ...token,
            accessToken: tokens.access_token,
            expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
            refreshToken: tokens.refresh_token ?? token.refreshToken,
        };
    })
    .catch((error) => {
      console.error("Error refreshing access token", error);
      return { ...token, error: "RefreshAccessTokenError" };
    });
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign in
      if (account) {
        // Save the access token and refresh token in the JWT on the initial login
        return {
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          refreshToken: account.refresh_token,
          user: token,
          // Extract roles if needed, depends on Keycloak config. 
          // Often in resource_access or realm_access. 
          // For now, let's assume decoding happens client side or we pass the token.
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Access token has expired, try to update it
      return requestRefreshOfAccessToken(token);
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      session.error = token.error;
      return session;
    },
  },
};
