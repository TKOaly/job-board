import NextAuth, { AuthOptions, DefaultUser } from "next-auth";

declare module 'next-auth' {
  interface Session {
    user?: DefaultUser & { admin: boolean }
  }
  
  interface User {
    admin: boolean
  }

  interface JWT {
    admin: boolean
  }
}

export const config: AuthOptions = {
  secret: 'unsecure',
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.admin = user.admin;
      return token;
    },

    async session({ session, token }) {
      session.user.admin = token.admin;
      return session;
    },
  },
  providers: [
    {
      id: 'tkoaly',
      name: 'TKO-äly Member Account',
      type: 'oauth',
      profile: async (profile) => {
        return {
          id: profile.sub,
          name: profile.nickname,
          admin: ['yllapitaja', 'virkailija'].includes(profile.role),
        };
      },
      issuer: 'http://users.tko-aly.localhost/',
      clientId: '47496d92-ce34-46db-92d1-00c107101894',
      clientSecret: 'unsecure',
      authorization: {
        url: 'http://users.tko-aly.localhost/oauth/authorize',
        params: { scope: 'openid role profile' },
      },
      client: {
        id_token_signed_response_alg: 'HS256',
      },
      token: 'http://user-service:3030/oauth/token',
    },
  ],
};
