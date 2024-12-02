"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "./components/ImageUpload";
import { useImageProcessing } from "./hooks/useImageProcessing";
import { useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import ImagePreview from "./components/ImagePreview";
import LoadingSpinner from "./components/LoadingSpinner";
import CompanySlider from "./components/CompanySlider";
import Title from "../components/Title";
import FeatureBox from "../components/FeatureBox";
import TrustedBy from "../components/TrustedBy";
import FAQ from "../components/FAQ";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";
import PricingCards from "../components/PricingCards";
import AdjustmentPanel from "./components/AdjustmentPanel"; // Import AdjustmentPanel
import ExportPanel from "./components/ExportPanel"; // Import ExportPanel
import { Palette, Zap, Eye, WandSparkles } from "lucide-react";

const referencePresets = [
  { id: 'tokyo-twilight', src: '/reference-images/Tokyo Twilight.jpg', alt: 'Tokyo Twilight' },
  { id: 'asteroid-city', src: '/reference-images/ASTEROID_CITY.jpg', alt: 'Asteroid City' },
  { id: 'barbie', src: '/reference-images/BARBIE.jpg', alt: 'Barbie' },
  { id: 'beautiful-boy', src: '/reference-images/Beautiful boy.jpg', alt: 'Beautiful Boy' },
  { id: 'blade-runner-2049', src: '/reference-images/BLADE RUNNER 2049.jpg', alt: 'Blade Runner 2049' },
  { id: 'blade-runner-original', src: '/reference-images/blade_runner_or.jpg', alt: 'Blade Runner Original' },
  { id: 'blade-runner-2049-alt', src: '/reference-images/bladerunner 2049.jpg', alt: 'Blade Runner 2049 Alt' },
  { id: 'cassie-marin', src: '/reference-images/Cassie Marin.jpg', alt: 'Cassie Marin' },
  { id: 'dream-scenario', src: '/reference-images/Dream scenario.jpg', alt: 'Dream Scenario' },
  { id: 'dune', src: '/reference-images/DUNE.jpg', alt: 'Dune' },
  { id: 'dunkirk', src: '/reference-images/dunkrik.jpg', alt: 'Dunkirk' },
  { id: 'edge-of-tomorrow', src: '/reference-images/EDGE OF TOMORROW.jpg', alt: 'Edge of Tomorrow' },
  { id: 'indiana-jones', src: '/reference-images/Indiana_jones.jpg', alt: 'Indiana Jones' },
  { id: 'inherent', src: '/reference-images/INHERENT.jpg', alt: 'Inherent' },
  { id: 'khalid', src: '/reference-images/KHALID.jpg', alt: 'Khalid' },
  { id: 'knock-at-the-cabin', src: '/reference-images/Knock at the cabin.jpg', alt: 'Knock at the Cabin' },
  { id: 'matrix', src: '/reference-images/MATRIX.jpg', alt: 'Matrix' },
  { id: 'monkey-man', src: '/reference-images/Monkey_man.jpg', alt: 'Monkey Man' },
  { id: 'nope', src: '/reference-images/NOPE.jpg', alt: 'Nope' },
  { id: 'oppenheimer', src: '/reference-images/oppenheimer.jpg', alt: 'Oppenheimer' },
  { id: 'oppenheimer-alt', src: '/reference-images/oppheimer.jpg', alt: 'Oppenheimer Alt' },
  { id: 'ready-player-one', src: '/reference-images/ready player one.jpg', alt: 'Ready Player One' },
  { id: 'relic', src: '/reference-images/RELIC.jpg', alt: 'Relic' },
  { id: 'reservation', src: '/reference-images/Reservation.jpg', alt: 'Reservation' },
  { id: 'revolutionary-road', src: '/reference-images/REVOLUTIONARY_ROAD.jpg', alt: 'Revolutionary Road' },
  { id: 'scary-stories', src: '/reference-images/Scary Stories to tell in the dark.jpg', alt: 'Scary Stories to Tell in the Dark' },
  { id: 'sex-education', src: '/reference-images/Sex education.jpg', alt: 'Sex Education' },
  { id: 'the-killer', src: '/reference-images/The killer.jpg', alt: 'The Killer' },
  { id: 'queens-gambit', src: '/reference-images/The queen_s gambit.jpg', alt: "The Queen's Gambit" },
  { id: 'water-diviner', src: '/reference-images/The water Diviner.jpg', alt: 'The Water Diviner' }
];

const Home = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [showAffilate, setShowAffiliate] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState<boolean>(false);

  const { data: session } = useSession();
  const { processImages, downloadLUT, lutData, adjustments, updateAdjustments } = useImageProcessing();

  useEffect(() => {
    const fetchCredits = async () => {
      try {
        const response = await fetch('/api/get-user-credits', {
          cache: 'no-store',
          credentials: 'include'
        });
        const data = await response.json();
        setCredits(data.credits);
      } catch (error) {
        console.error('Error fetching credits:', error);
        setCredits(0);
      }
    };

    fetchCredits();
    const intervalId = setInterval(fetchCredits, 30000);
    return () => clearInterval(intervalId);
  }, [session]);

  const handleProcess = async () => {
    if (!originalImage || !referenceImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const { processedImage: newProcessedImage } = await processImages(originalImage, referenceImage);
      setProcessedImage(newProcessedImage);
      
      // Decrease credits after successful processing
      const response = await fetch('/api/decrease-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
      }
    } catch (error: any) {
      setError(error?.message || 'An error occurred during processing');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar setShowTutorial={setShowTutorial} setShowAffiliate={setShowAffiliate} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center mb-12">
          <Title />
          <p className="text-gray-400 mt-2 text-center">
          Create Customized Luts in just a Click
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ImageUpload
            title="Original Image"
            image={originalImage}
            onImageSelect={setOriginalImage}
            onImageRemove={() => setOriginalImage(null)}
          />
          <ImageUpload
            title="Reference Image"
            image={referenceImage}
            onImageSelect={setReferenceImage}
            onImageRemove={() => setReferenceImage(null)}
            presetImages={referencePresets}
          />
        </div>

        <div className="flex flex-col items-center gap-4 relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => (session ? handleProcess() : setShowPopup(true))}
            className={`w-full max-w-md px-8 py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300 bg-[#00FF66]/90 hover:bg-[#00FF66] neon-glow ${
              !originalImage || !referenceImage || isProcessing && "opacity-50 cursor-not-allowed"
            }`}
            disabled={!originalImage || !referenceImage || isProcessing}
          >
<WandSparkles />
            {isProcessing ? 'Generating...' : 'Generate LUT'}
          </motion.button>
          {credits !== null && (
            <p className="text-sm text-gray-400">
              {credits === -1 
                ? "Unlimited LUTs available" 
                : `${credits} LUTs remaining`}
            </p>
          )}
        </div>

        {processedImage && (
          <>
            <ImagePreview
              originalImage={originalImage}
              referenceImage={referenceImage}
              processedImage={processedImage}
              isProcessing={isProcessing}
            />
            <div className="flex gap-6">
              <AdjustmentPanel
                adjustments={adjustments}
                onAdjustmentsChange={(newAdjustments) => {
                  const updatedImage = updateAdjustments(newAdjustments);
                  if (updatedImage) {
                    setProcessedImage(updatedImage);
                  }
                }}
              />
              <ExportPanel onExport={downloadLUT} />
            </div>
          </>
        )}

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        <CompanySlider />

        {/* Feature Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 mb-16">
          <FeatureBox
            icon={Palette}
            title="AI-Powered Color Match"
            description="Advanced algorithms that perfectly match your reference images"
          />
          <FeatureBox
            icon={Zap}
            title="Professional LUTs"
            description="Export industry-standard LUTs compatible with major editing software"
          />
          <FeatureBox
            icon={Eye}
            title="Real-time Preview"
            description="See changes instantly with our real-time preview system"
          />
        </div>

        {/* Pricing Section */}
        <PricingCards />

        {/* Contact Section */}
        <div className="w-full max-w-4xl mx-auto mt-16 px-4">
          <div className="bg-dark-800 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Need Customized LUTs?</h2>
            <p className="text-gray-400 mb-6">Contact our team for personalized LUT creation services and custom solutions</p>
            <a 
              href="mailto:contact@lutgeneratorpro.com" 
              className="inline-flex items-center gap-2 bg-[#00FF66]/90 hover:bg-[#00FF66] text-white font-semibold py-3 px-6 rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Contact Team
            </a>
          </div>
        </div>

        {/* Reviews Section */}
        <Reviews />

        {/* FAQ Section */}
        <FAQ />
      </main>

      <Footer />

      {showTutorial && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Tutorial content */}
        </div>
      )}

      {showAffilate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          {/* Affiliate content */}
        </div>
      )}

      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-red-500 text-white p-4 rounded-lg">
            {error}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
