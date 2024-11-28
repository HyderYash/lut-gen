'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    name: 'Sarah Johnson',
    role: 'Professional Photographer',
    avatar: '/avatars/sarah.jpg',
    rating: 5,
    text: 'The AI-powered color matching is incredibly accurate. It saves me hours of manual color grading work and delivers consistent results every time.',
  },
  {
    name: 'Michael Chen',
    role: 'Film Director',
    avatar: '/avatars/michael.jpg',
    rating: 5,
    text: 'This tool has revolutionized our post-production workflow. The LUTs generated are professional-grade and the real-time preview feature is a game-changer.',
  },
  {
    name: 'Emma Davis',
    role: 'Content Creator',
    avatar: '/avatars/emma.jpg',
    rating: 5,
    text: 'As a YouTuber, consistency in color grading is crucial. This tool helps me maintain my signature look across all my videos effortlessly.',
  }
];

const Reviews = () => {
  return (
    <section className="w-full py-20 bg-gradient-to-b from-black/0 to-black/20">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white via-white to-gray-400 text-transparent bg-clip-text">
              What Our Users Say
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied creators who have transformed their workflow with our AI-powered LUT generator
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-white">{review.name}</h3>
                  <p className="text-sm text-gray-400">{review.role}</p>
                </div>
              </div>
              
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                ))}
              </div>
              
              <p className="text-gray-300">
                "{review.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
