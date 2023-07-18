'use client';

import { SessionProvider } from "next-auth/react";

export const NextAuthProviders = ({ children }) => (
  <SessionProvider>{children}</SessionProvider>
)
