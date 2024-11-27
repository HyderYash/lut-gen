"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { AnimatePresence } from "framer-motion"

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // First check if user exists
      const checkResponse = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const { exists } = await checkResponse.json()

      if (exists) {
        setError("An account with this email already exists")
        return
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        isSignUp: true,
      })

      if (!result?.error) {
        // For new sign-ups, redirect to referral page
        router.push(`/auth/referral${referralCode ? `?code=${referralCode}` : ""}`)
      } else {
        setError("Failed to create account")
      }
    } catch (error: any) {
      setError(error.message || "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      // For Google sign-up, include isSignUp parameter
      const searchParams = new URLSearchParams()
      searchParams.set("isSignUp", "true")
      if (referralCode) {
        searchParams.set("code", referralCode)
      }
      
      await signIn("google", {
        callbackUrl: `/auth/referral?${searchParams.toString()}`
      })
    } catch (error: any) {
      setError(error.message || "Failed to sign in with Google")
    }
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
            Create Account
            <div className="absolute -inset-1 bg-primary/10 blur-xl opacity-50" />
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-gray-400"
          >
            Join us and start your creative journey
          </motion.p>
        </div>

        {/* Sign Up Form */}
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
              <div className="space-y-4">
                {/* Email Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
                    placeholder="Enter your email"
                  />
                </motion.div>

                {/* Password Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
                    placeholder="Create a password"
                  />
                </motion.div>

                {/* Confirm Password Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
                    placeholder="Confirm your password"
                  />
                </motion.div>

                {/* Referral Code Input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <label htmlFor="referralCode" className="block text-sm font-medium text-gray-300 mb-2">
                    Referral Code (Optional)
                  </label>
                  <input
                    id="referralCode"
                    name="referralCode"
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    className="w-full px-4 py-3 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 hover:border-primary/50"
                    placeholder="Enter referral code"
                  />
                </motion.div>
              </div>

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

              {/* Sign Up Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative">
                    {isLoading ? "Creating account..." : "Create Account"}
                  </span>
                </motion.button>
              </motion.div>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#3A3A3A]" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#1A1A1A] text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google Sign Up */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.02, backgroundColor: '#3A3A3A' }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="relative w-full flex items-center justify-center gap-3 py-3 px-4 bg-[#2A2A2A] text-white font-medium rounded-lg transition-all duration-300 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="relative">Continue with Google</span>
                </motion.button>
              </motion.div>

              {/* Sign In Link and Home Link */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="text-center mt-6 space-y-2"
              >
                <div>
                  <span className="text-gray-400">Already have an account? </span>
                  <Link 
                    href="/auth/signin" 
                    className="text-primary hover:text-primary-dark font-medium transition-colors duration-300"
                  >
                    Sign in
                  </Link>
                </div>
                <div>
                  <Link 
                    href="/"
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                  </Link>
                </div>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
