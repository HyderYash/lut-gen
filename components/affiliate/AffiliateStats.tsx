"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

export function AffiliateStats() {
  const { data: session } = useSession()
  const [copied, setCopied] = useState(false)
  const referralCode = session?.user?.referralCode || ""

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode)
    setCopied(true)
    toast.success("Referral code copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <div className="relative px-8 py-7 bg-[#0A0A0A] rounded-2xl">
          <div className="flex flex-col gap-6">
            {/* Title Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-30"></div>
                <div className="relative bg-[#1A1A1A] text-primary w-14 h-14 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-1">
                  Your Referral Code
                </div>
                <div className="text-gray-400">Share this code to start earning commissions</div>
              </div>
            </div>

            {/* Code Display Section */}
            <div className="relative p-6 bg-[#0D0D0D] rounded-xl group/code">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-xl opacity-0 group-hover/code:opacity-100 transition duration-500 blur"></div>
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="font-mono text-2xl text-gray-300 tracking-wide">
                      {referralCode}
                    </div>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="relative group/button flex-shrink-0"
                  >
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-75 group-hover/button:opacity-100 transition duration-500"></div>
                    <div className="relative px-6 py-3 bg-[#0A0A0A] rounded-xl text-white flex items-center gap-2 group-hover/button:bg-[#0D0D0D] transition-colors">
                      {copied ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                          </svg>
                          <span className="font-medium">Copy Code</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
