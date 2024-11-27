"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"

export default function ReferralCodeGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { data: session, update } = useSession()
  const referralCode = session?.user?.referralCode

  const generateReferralCode = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/update-referral", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message)
        return
      }

      // Update session to show new referral code
      await update()
    } catch (error: any) {
      setError(error.message || "Failed to generate referral code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900">Your Referral Code</h3>
      
      {referralCode ? (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Share this code with your friends:</p>
          <div className="mt-1 flex items-center gap-2">
            <code className="px-2 py-1 bg-gray-100 rounded text-lg font-mono">
              {referralCode}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(referralCode)}
              className="text-indigo-600 hover:text-indigo-500 text-sm"
            >
              Copy
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-sm text-gray-500">Generate a code to start referring friends!</p>
          <button
            onClick={generateReferralCode}
            disabled={isLoading}
            className="mt-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? "Generating..." : "Generate Code"}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
