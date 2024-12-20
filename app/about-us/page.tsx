"use client"

import { Target, Globe, Zap, ArrowRight } from 'lucide-react'
import Navbar from '@/components/Navbar'

export default function AboutUsPage() {
  const aboutUsSections = [
    {
      title: "Meet LUTBuilder.ai – Your AI-Driven Path to Effortless Color Grading",
      content: "Welcome to LUTBuilder.ai, the world's first AI-powered LUT creation platform designed to transform the way creatives approach color grading. Our mission is simple: to empower filmmakers, videographers, photographers, and digital content creators of all skill levels to achieve professional-grade cinematic looks—faster and more intuitively than ever before."
    },
    {
      title: "Who We Are",
      content: "We're a team of passionate innovators, filmmakers, and visual artists who understand that stunning imagery hinges on color perfection. Frustrated with time-consuming traditional workflows, we integrated advanced artificial intelligence into an intuitive, web-based solution. The result is LUTBuilder.ai: a groundbreaking platform that combines cutting-edge technology, user-friendly design, and powerful customization tools to help you elevate every frame."
    },
    {
      title: "Our Vision",
      content: "We envision a creative landscape where color grading is no longer a complex hurdle, but an accessible avenue for expression. By harnessing the potential of AI-driven color grading, we're bridging the gap between professional standards and everyday creators—helping storytellers everywhere bring their visions to life."
    },
    {
      title: "Why Choose LUTBuilder.ai?",
      content: "Our platform offers unparalleled features that set us apart in the world of color grading:",
      features: [
        "First-of-Its-Kind AI Integration",
        "Rich Library of Inspiring References",
        "Full Creative Control",
        "Fast, Intuitive, and Accessible"
      ]
    },
    {
      title: "Join Our Community",
      content: "When you use LUTBuilder.ai, you're not just accessing cutting-edge color tools—you're joining a growing community of creators pushing the boundaries of visual storytelling. Share your LUTs, compare results, and exchange tips with fellow filmmakers, photographers, and content creators who are as passionate about elevating visuals as you are."
    }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* About Us Content */}
          <div className="space-y-16">
            {aboutUsSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent leading-tight">
                  {section.title}
                </h2>
                <p className="text-gray-300 text-lg">{section.content}</p>
                
                {section.features && (
                  <div className="grid md:grid-cols-2 gap-3 mt-4">
                    {section.features.map((feature, idx) => (
                      <div 
                        key={idx} 
                        className="bg-[#1A1F2C] p-4 rounded-lg hover:bg-[#2A2F3C] transition-colors"
                      >
                        <p className="text-gray-200">{feature}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Insights Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-[#1A1F2C] p-6 rounded-xl border border-white/10 hover:scale-105 transition">
              <Target className="text-neon-green mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-gray-400">
                Democratizing professional color grading through AI technology
              </p>
            </div>

            <div className="bg-[#1A1F2C] p-6 rounded-xl border border-white/10 hover:scale-105 transition">
              <Globe className="text-neon-green mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">Global Impact</h3>
              <p className="text-gray-400">
                Empowering creators worldwide with accessible color tools
              </p>
            </div>

            <div className="bg-[#1A1F2C] p-6 rounded-xl border border-white/10 hover:scale-105 transition">
              <Zap className="text-neon-green mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">Continuous Innovation</h3>
              <p className="text-gray-400">
                Constantly evolving to meet the creative needs of our community
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-16 text-center bg-gradient-to-r from-[#1A1F2C] to-[#2A2F3C] p-8 rounded-xl">
            <h3 className="text-3xl font-bold mb-4 text-white">
              Ready to Transform Your Creative Workflow?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Join the AI-powered color grading revolution. Elevate your visual storytelling with LUTBuilder.ai.
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-neon-green text-black px-8 py-4 rounded-lg font-semibold hover:bg-opacity-90 transition text-lg"
            >
              Get Started <ArrowRight size={24} />
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}