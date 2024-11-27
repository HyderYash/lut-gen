"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function ReferralPage() {
  const [referralCode, setReferralCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/update-referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      router.push("/")
    } catch (error: any) {
      setError(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    router.push("/")
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
      <div className="absolute -top-[40rem] -left-[40rem] w-[80rem] h-[80rem] bg-primary/5 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-[40rem] -right-[40rem] w-[80rem] h-[80rem] bg-primary/5 rounded-full blur-3xl opacity-20" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold text-white mb-2 relative"
          >
            Enter Referral Code
            <div className="absolute -inset-1 bg-primary/10 blur-xl opacity-50" />
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-400"
          >
            Have a referral code? Enter it below to get bonus credits!
          </motion.p>
        </div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-[#1A1A1A] rounded-2xl p-8 shadow-xl relative group"
        >
          {/* Form Glow Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          <div className="relative">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Referral Code Input */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300 mb-2">
                  Referral Code
                </label>
                <input
                  id="referralCode"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
                  placeholder="Enter your referral code"
                />
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-500 text-sm text-center bg-red-500/10 py-2 px-4 rounded-lg"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading || !referralCode}
                  className="relative flex-1 py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">
                    {isLoading ? "Checking..." : "Submit"}
                  </span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleSkip}
                  className="relative flex-1 py-3 px-4 bg-[#2A2A2A] text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group hover:bg-[#3A3A3A]"
                >
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">Skip</span>
                </motion.button>
              </motion.div>

              {/* Home Link */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center mt-6"
              >
                <Link 
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Home
                </Link>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
