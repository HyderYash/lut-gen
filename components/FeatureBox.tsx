"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureBoxProps {
  icon: LucideIcon
  title: string
  description: string
}

const FeatureBox = ({ icon: Icon, title, description }: FeatureBoxProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="relative bg-[#0A1A1A] rounded-2xl p-8 border border-emerald-950/20 overflow-hidden group"
    >
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/20 via-transparent to-transparent" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="w-12 h-12 rounded-full bg-emerald-950/30 flex items-center justify-center mb-6">
          <Icon className="w-6 h-6 text-emerald-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
        <p className="text-gray-400 mb-6">{description}</p>
        <motion.button
          whileHover={{ x: 5 }}
          whileTap={{ scale: 0.95 }}
          className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-2 group-hover:gap-3 duration-300"
        >
          Learn more <span className="text-lg">→</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

export default FeatureBox
