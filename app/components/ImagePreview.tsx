"use client"
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageComparison from './ImageComparison';
import { Download } from 'lucide-react';

interface ImagePreviewProps {
  originalImage: string;
  referenceImage: string;
  processedImage: string;
  isProcessing?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  originalImage,
  referenceImage,
  processedImage,
  isProcessing = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-800 rounded-xl shadow-xl p-6 mb-8"
    >
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Preview</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="text-gray-200 font-medium">Reference Style</h3>
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = referenceImage;
                  link.download = 'reference-style.jpg';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                className="text-primary hover:text-primary-light transition-colors"
              >
                <Download size={20} />
              </motion.button>
          </div>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-dark-900">
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
                >
                  <div className="loading-spinner" />
                </motion.div>
              )}
            </AnimatePresence>
            <img
              src={referenceImage}
              alt="Reference"
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-gray-200 font-medium">Before / After</h3>
          <div className="relative aspect-square rounded-lg overflow-hidden bg-dark-900">
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 z-10"
                >
                  <div className="loading-spinner" />
                </motion.div>
              )}
            </AnimatePresence>
            <ImageComparison
              beforeImage={originalImage}
              afterImage={processedImage}
              className="w-full h-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ImagePreview;