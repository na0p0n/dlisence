import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { SignJWT, jwtVerify } from "jose"
import type { JWT } from "next-auth/jwt"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // ゲストモード：ランダム UUID で匿名セッションを発行
    Credentials({
      id: "guest",
      name: "ゲスト",
      credentials: {},
      async authorize() {
        return {
          id: `guest_${crypto.randomUUID()}`,
          name: "ゲスト",
          email: null,
          image: null,
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  // Spring Boot 側で NEXTAUTH_SECRET を使って検証できるよう HS256 署名に統一
  jwt: {
    encode: async ({ token, secret }) => {
      const key = new TextEncoder().encode(
        Array.isArray(secret) ? secret[0] : secret,
      )
      return await new SignJWT(token as Record<string, unknown>)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("30d")
        .sign(key)
    },
    decode: async ({ token, secret }) => {
      if (!token) return null
      const key = new TextEncoder().encode(
        Array.isArray(secret) ? secret[0] : secret,
      )
      try {
        const { payload } = await jwtVerify(token, key)
        return payload as JWT
      } catch {
        return null
      }
    },
  },
  callbacks: {
    async jwt({ token, account }) {
      // Discord ログイン時に discord_user_id を保存（DM通知連携用）
      if (account?.provider === "discord") {
        token.discordId = account.providerAccountId
      }
      if (account?.provider === "guest") {
        token.isGuest = true
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub!
      if (token.discordId) {
        session.user.discordId = token.discordId as string
      }
      if (token.isGuest) {
        session.user.isGuest = true
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
