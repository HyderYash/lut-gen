"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { motion } from "framer-motion"
import { AffiliateStats } from "@/components/affiliate/AffiliateStats"
import Navbar from "@/components/Navbar"

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
      <div className="min-h-screen bg-[#0A0A0A] overflow-x-hidden">
        <Navbar setShowTutorial={() => {}} setShowAffiliate={() => {}} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.8, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-primary"
            >
              <svg className="w-12 h-12 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const features = [
    {
      title: "Lifetime Commissions",
      description: "Earn 20% recurring commission on every subscription, forever",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: "Performance Bonuses",
      description: "Unlock higher commission rates up to 35% based on performance",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      title: "Special Rewards",
      description: "Earn exclusive bonuses and rewards for hitting milestones",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
    },
  ]

  const tiers = [
    { range: "0-10", rate: "20%", title: "Starter", description: "Begin your journey" },
    { range: "11-20", rate: "25%", title: "Bronze", description: "Growing influence" },
    { range: "21-50", rate: "30%", title: "Silver", description: "Established partner" },
    { range: "51+", rate: "35%", title: "Gold", description: "Elite performer" },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      <Navbar setShowTutorial={() => {}} setShowAffiliate={() => {}} />
      
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent" />
        <div className="container mx-auto px-4 pt-24 pb-32 relative z-10 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-primary/50">
              Affiliate Dashboard
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Join our affiliate program and earn unlimited commissions by sharing LUT Generator Pro
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 -mt-20">
        <AffiliateStats />
      </div>

      {/* Features Section */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-2xl p-8 relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-[1px] bg-[#1A1A1A] rounded-2xl" />
                <div className="relative">
                  <div className="text-primary mb-6 bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center backdrop-blur-xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Commission Tiers */}
      <div className="relative py-24">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
        <div className="container mx-auto px-4 max-w-7xl relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary/80">
              Commission Tiers
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Earn more as you grow. Our tiered commission structure rewards your success with higher rates
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-2xl relative group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-[1px] bg-[#1A1A1A] rounded-2xl" />
                <div className="p-8 relative">
                  <div className="text-3xl font-bold text-primary mb-2">{tier.rate}</div>
                  <div className="text-xl font-semibold mb-2">{tier.title}</div>
                  <div className="text-gray-400 mb-4">{tier.description}</div>
                  <div className="text-sm text-gray-500">
                    {tier.range} referrals
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Milestone Bonus */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-12 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-2xl relative group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="absolute inset-[1px] bg-[#1A1A1A] rounded-2xl" />
            <div className="p-8 relative text-center">
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-primary/80">
                Special Milestone Bonus
              </h3>
              <p className="text-lg">
                Reach <span className="text-primary font-bold">100 referrals</span> and receive a{" "}
                <span className="text-primary font-bold">$100 bonus</span> on top of your commissions!
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
