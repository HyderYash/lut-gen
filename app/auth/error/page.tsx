"use client"

import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"

const AuthError = () => {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "An error occurred during authentication"
  if (error === "OAuthSignin") errorMessage = "Error occurred during OAuth sign in"
  if (error === "OAuthCallback")
    errorMessage = "Error occurred during OAuth callback"
  if (error === "OAuthCreateAccount")
    errorMessage = "Could not create OAuth account"
  if (error === "EmailCreateAccount")
    errorMessage = "Could not create email account"
  if (error === "Callback") errorMessage = "Error occurred during callback"
  if (error === "OAuthAccountNotLinked")
    errorMessage = "Email already used with different provider"
  if (error === "EmailSignin") errorMessage = "Check your email address"
  if (error === "CredentialsSignin")
    errorMessage = "Invalid email or password"
  if (error === "SessionRequired")
    errorMessage = "Please sign in to access this page"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {errorMessage}
          </p>
        </div>
        <div className="flex justify-center">
          <Link href="/auth/signin" passHref>
            <motion.span
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            >
              Return to Sign In
            </motion.span>
          </Link>
        </div>
      </div>
    </div>
  )
}

import { Suspense } from "react"

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthError />
    </Suspense>
  )
}
