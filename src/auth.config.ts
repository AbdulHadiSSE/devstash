import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    GitHub,
    Credentials({
      credentials: { email: {}, password: {} },
      // Edge-safe placeholder — bcrypt/Prisma can't run here. auth.ts
      // (Node.js runtime) overrides this provider with the real check.
      authorize: () => null,
    }),
  ],
} satisfies NextAuthConfig;
