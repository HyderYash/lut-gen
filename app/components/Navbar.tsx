"use client"

import React, { useState } from "react"
import { Info, LogOut, User, DollarSign, Link2, SquareUserRound } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

interface NavbarProps {
  setShowTutorial: (show: boolean) => void
}

const Navbar = ({ setShowTutorial }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const { data: session } = useSession()

  return (
    <nav className="bg-black/20 backdrop-blur-sm text-white sticky top-0 z-50 shadow-xl border-b border-white/10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold flex items-center gap-2"
        >
          <Link href="/">LUT Builder</Link>
        </motion.h1>

        <div className="flex items-center gap-4">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setShowTutorial(true)}
          >
            <Info size={20} />
            How it works
          </motion.button>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <DollarSign size={20} />
            <Link href="/pricing">Pricing</Link>
          </motion.div>
          {session && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <Link2 size={20} />
              <Link href="/affiliate">Affiliate</Link>
            </motion.div>
          )}
          {session ? (
            <div className="relative">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setMenuOpen((prev) => !prev)}
              >
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <User className="w-8 h-8 text-white border border-white/20 rounded-full p-1" />
                )}
              </motion.button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg border border-gray-200">
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100 transition"
                  >
                    <LogOut className="w-5 h-5 text-gray-600" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <SquareUserRound size={20} />
              <Link href="/auth/signin">Get Started</Link>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
