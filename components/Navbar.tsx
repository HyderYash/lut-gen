"use client"

import React, { useState } from "react"
import { Info, LogOut, User, DollarSign, Link2, SquareUserRound, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { signOut, useSession } from "next-auth/react"
import GalleryModal from "@/app/components/GalleryModal"

interface NavbarProps {
  setShowTutorial: (show: boolean) => void
  setShowAffiliate?: (show: boolean) => void
  onImageSelect?: (src: string) => void
}

const Navbar = ({ setShowTutorial, setShowAffiliate, onImageSelect }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false)
  const [showGallery, setShowGallery] = useState(false);
  const { data: session } = useSession()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-white">
              <Image
                src="/logo.png"
                alt="LUT Builder AI Logo"
                width={300}
                height={300}
                className="w-auto h-[4rem]"
                priority
              />
            </Link>

            <div className="flex items-center gap-4">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowGallery(true)}
              >
                <Info size={20} />
                Gallery
              </motion.button>
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                onClick={() => setShowHowItWorks(true)}
              >
                <Info size={20} />
                How it works
              </motion.button>
              {/* <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <DollarSign size={20} />
                <Link href="/pricing">Pricing</Link>
              </motion.div> */}
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
        </div>
      </nav>
      <GalleryModal
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        onImageSelect={(src) => {
          if (onImageSelect) {
            onImageSelect(src);
          }
        }}
      />
      {/* How it Works Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowHowItWorks(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="relative bg-gradient-to-br from-gray-900/80 via-gray-900 to-black rounded-3xl shadow-2xl border border-white/10 w-full max-w-2xl backdrop-blur-xl">
                {/* Animated gradient background */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/0 to-emerald-500/5 animate-gradient-shift" />
                
                {/* Glow effects */}
                <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
                
                <div className="relative max-h-[80vh] overflow-y-auto custom-scrollbar">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-white to-emerald-300 bg-clip-text text-transparent mb-2">
                          How It Works
                        </h2>
                        <p className="text-gray-400">Create stunning LUTs in four simple steps</p>
                      </div>
                      <button
                        onClick={() => setShowHowItWorks(false)}
                        className="text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-full p-2"
                      >
                        <X size={24} />
                      </button>
                    </div>
                    
                    <div className="space-y-8 text-gray-300">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 group hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">1</span>
                          Upload Your Image
                        </h3>
                        <p className="relative z-10">Simply drag and drop or click to upload the image you want to enhance. We support most common image formats.</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 group hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">2</span>
                          Choose Your Style
                        </h3>
                        <p className="relative z-10">Select from our collection of professional presets or upload a reference image to match its style.</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 group hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">3</span>
                          Generate Your LUT
                        </h3>
                        <p className="relative z-10">Our AI will analyze your image and create a custom LUT that matches your desired style.</p>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="relative p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 group hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-3">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">4</span>
                          Download & Use
                        </h3>
                        <p className="relative z-10">Download your generated LUT in various formats compatible with popular editing software.</p>
                      </motion.div>
                      
                      <div className="pt-6 border-t border-white/10">
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <Info size={16} className="text-emerald-500" />
                          Need more help? Check out our detailed tutorials or contact our support team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.4);
        }

        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </>
  )
}

export default Navbar
