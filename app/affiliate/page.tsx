"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { AffiliateStats } from "@/components/affiliate/AffiliateStats"
import Navbar from "@/app/components/Navbar"

export default function AffiliatePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen">
        <Navbar setShowTutorial={() => {}} setShowAffiliate={() => {}} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navbar setShowTutorial={() => {}} setShowAffiliate={() => {}} />
              
      <AffiliateStats />
      <div className="container mx-auto px-4 py-8">
        <div className="rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <div className="space-y-4">
            <p>Join our affiliate program and earn commissions for every successful referral!</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Base Commission: 20% recurring commission on each subscription</li>
              <li>Tier Bonuses:
                <ul className="list-disc pl-5 mt-2">
                  <li>First 10 Referrals: 20% commission per sale</li>
                  <li>11-20 Referrals: 25% commission per sale</li>
                  <li>21-50 Referrals: 30% commission per sale</li>
                  <li>51+ Referrals: 35% commission per sale</li>
                </ul>
              </li>
              <li>Milestone Bonus: $100 bonus when you reach 100 referrals</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  )
}
