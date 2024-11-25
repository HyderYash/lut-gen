"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "./components/ImageUpload";
import { useImageProcessing } from "./hooks/useImageProcessing";
import Link from "next/link";
import { useSession } from "next-auth/react"
import Navbar from "./components/Navbar";

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

const Popup: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="bg-white rounded-lg p-8 shadow-2xl w-96 text-center relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        ✕
      </button>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Login Required</h2>
      <p className="text-sm text-gray-600 mb-8">
        You need to log in to access this feature. Please log in or close this popup to return.
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onClose}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition"
        >
          Close
        </button>
        <Link
          href="/api/auth/login"
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition"
        >
          Log In
        </Link>
      </div>
    </div>
  </motion.div>
);

const Home: React.FC = () => {
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
  const { processImages } = useImageProcessing();

  useEffect(() => {
    const fetchCredits = async () => {
      if (session) {
        try {
          const response = await fetch("/api/get-user-credits");
          const data = await response.json();
          setCredits(data.credits);
        } catch (error) {
          console.error("Error fetching credits:", error);
          setCredits(0);
        }
      } else {
        setCredits(0);
      }
    };

    fetchCredits();
  }, [session]);

  const handleProcess = async () => {
    if (!originalImage || !referenceImage) return;
    
    // Check if user has unlimited credits (credits === -1) or has remaining credits
    if (credits === null || (credits !== -1 && credits <= 0)) {
      setError("You have reached the maximum limit of LUTs. Please upgrade your plan for more.");
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // First decrease credits
      const creditResponse = await fetch("/api/decrease-credits", {
        method: "POST",
      });
      const creditData = await creditResponse.json();
      
      if (!creditResponse.ok) {
        throw new Error(creditData.error || "Failed to process credits");
      }

      // Then generate LUT
      const processed = await processImages(originalImage, referenceImage);
      setProcessedImage(processed);
      
      // Update credits state after successful processing
      setCredits(creditData.credits);
    } catch (err) {
      console.error(err);
      setError("Failed to process images. Please try again.");
      
      // If error occurred after decreasing credits, try to restore them
      if (credits !== -1 && credits > 0) {
        try {
          const response = await fetch("/api/get-user-credits");
          const data = await response.json();
          setCredits(data.credits);
        } catch (error) {
          console.error("Error restoring credits:", error);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar setShowTutorial={setShowTutorial} setShowAffiliate={setShowAffiliate} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
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
            className={`px-8 py-4 rounded-lg font-semibold text-white transition-colors duration-200 ${
              !originalImage || !referenceImage || isProcessing
                ? "bg-gray-600/50"
                : "bg-primary hover:bg-primary-dark"
            }`}
            disabled={!originalImage || !referenceImage || isProcessing}
          >
            Generate LUT
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
          <div className="flex flex-col items-center gap-4">
            <img
              src={processedImage}
              alt="Processed"
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center">{error}</div>
        )}

        <AnimatePresence>
          {showPopup && <Popup onClose={() => setShowPopup(false)} />}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Home;
