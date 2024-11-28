"use client"

import React from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const Title = () => {
  return (
    <motion.h1
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="text-5xl font-bold flex items-center gap-1"
    >
      <Link href="/" className="text-white">
        LUT Builder{" "}
        <span className="text-emerald-400">AI</span>
      </Link>
    </motion.h1>
  )
}

export default Title
