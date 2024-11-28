"use client"

import React from 'react'
import { motion } from 'framer-motion'

const TrustedBy = () => {
  return (
    <div className="w-full py-12">
      <div className="flex flex-col items-center justify-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <span className="text-xl font-medium text-gray-400">TRUSTED BY</span>{' '}
          <span className="text-2xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text">
            LEADING BRANDS
          </span>
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-center gap-12 mt-8"
        >
          <img src="/brands/adobe.svg" alt="Adobe" className="h-6 opacity-50 hover:opacity-80 transition-opacity" />
          <img src="/brands/canon.svg" alt="Canon" className="h-6 opacity-50 hover:opacity-80 transition-opacity" />
          <img src="/brands/sony.svg" alt="Sony" className="h-6 opacity-50 hover:opacity-80 transition-opacity" />
          <img src="/brands/nikon.svg" alt="Nikon" className="h-6 opacity-50 hover:opacity-80 transition-opacity" />
          <img src="/brands/dji.svg" alt="DJI" className="h-6 opacity-50 hover:opacity-80 transition-opacity" />
        </motion.div>
      </div>
    </div>
  )
}

export default TrustedBy
