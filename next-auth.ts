import { AuthOptions, DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & { admin: boolean };
  }

  interface User {
    admin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    admin: boolean;
  }
}

export const config: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.admin = user.admin;
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.admin = token.admin;
      }

      return session;
    },
  },
  providers: [
    {
      id: 'tkoaly',
      name: 'TKO-äly Member Account',
      type: 'oauth',
      profile: async profile => {
        return {
          id: profile.sub,
          name: profile.nickname,
          admin: ['yllapitaja', 'virkailija'].includes(profile.role),
        };
      },
      issuer: process.env.OAUTH_ISSUER,
      clientId: process.env.SERVICE_ID,
      clientSecret: process.env.SERVICE_SECRET,
      authorization: {
        url: process.env.OAUTH_AUTHORIZATION_URL,
        params: { scope: 'openid role profile' },
      },
      client: {
        id_token_signed_response_alg: 'HS256',
      },
      token: process.env.OAUTH_TOKEN_URL,
    },
  ],
};
