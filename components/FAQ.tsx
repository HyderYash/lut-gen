'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'What is a LUT and how does it work?',
    answer: 'A LUT (Look Up Table) is a powerful color grading tool that transforms the colors in your images or videos according to predefined values. It works by mapping source colors to target colors, allowing you to achieve consistent and professional-looking results across your content.'
  },
  {
    question: 'How does AI enhance the LUT generation process?',
    answer: 'Our AI technology analyzes your reference images and automatically generates custom LUTs that match your desired color style. It understands color relationships, lighting conditions, and artistic intent to create precise color transformations that would traditionally require hours of manual work.'
  },
  {
    question: 'Can I use these LUTs in my preferred editing software?',
    answer: 'Yes! Our LUTs are compatible with all major editing software including Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, and more. We provide files in industry-standard formats (.cube, .3dl) for maximum compatibility.'
  },
  {
    question: 'Are the generated LUTs royalty-free?',
    answer: 'Absolutely! Once you generate a LUT, you own it completely. You can use it in personal or commercial projects without any additional fees or attribution requirements.'
  },
  {
    question: 'How accurate are the AI-generated LUTs?',
    answer: 'Our AI has been trained on millions of professional-grade images and color transformations. It achieves high accuracy in matching reference colors while maintaining natural-looking results. You can also fine-tune the generated LUTs to perfectly match your vision.'
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="w-full py-16 bg-black/20">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-center mb-12"
        >
          <span className="bg-gradient-to-r from-white via-white to-gray-400 text-transparent bg-clip-text">
            Frequently Asked Questions
          </span>
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-4 text-gray-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
