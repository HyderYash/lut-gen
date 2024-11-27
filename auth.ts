import type { NextAuthConfig } from "next-auth"
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export const config: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.password) {
          throw new Error("User not found")
        }

        const isValid = await bcrypt.compare(credentials.password as string, user.password as string)

        if (!isValid) {
          throw new Error("Invalid password")
        }

        return user
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (account?.provider === "google") {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          })

          if (!existingUser) {
            const customerId = `cus_${Math.random().toString(36).substring(2, 15)}`
            const initialReferralCode = `REF_${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name,
                image: user.image,
                plan: "free",
                customerId,
                credits: 15,
                referralCode: initialReferralCode,
              },
            })
          }
        }
        return true
      } catch (error) {
        console.error("Sign in error:", error)
        return false
      }
    },
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email! },
        })

        if (dbUser) {
          session.user.id = dbUser.id
          session.user.plan = dbUser.plan
          session.user.referralCode = dbUser.referralCode || ""
          session.user.credits = dbUser.credits
          session.user.customerId = dbUser.customerId || ""
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // If it's a sign-in attempt and not a new user, redirect to home
      if (url.includes("/auth/referral") && !url.includes("isSignUp=true")) {
        return baseUrl
      }
      
      // For all other cases, follow standard redirect rules
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith("/")) return `${baseUrl}${url}`
      return baseUrl
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    newUser: "/auth/referral"
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

export const { handlers, auth, signIn, signOut } = NextAuth(config)
