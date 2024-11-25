import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string | null
      name: string | null
      image: string | null
      plan: string
      referralCode?: string
      credits: number
      customerId?: string
    } & DefaultSession["user"]
  }

  interface User {
    id: string
    email: string | null
    name: string | null
    image: string | null
    plan: string
    referralCode?: string
    credits: number
    customerId?: string
  }
}
