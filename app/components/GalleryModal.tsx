"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { event } from '@/components/GoogleAnalytics';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (src: string) => void;
}

// Sample preset images (same as in ImageUpload)
const presetImages = [
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

const GalleryModal = ({ isOpen, onClose, onImageSelect }: GalleryModalProps) => {
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);

  const handleImageSelect = (src: string) => {
    onImageSelect(src);
    event('reference_image_gallery_select', 'engagement', `Selected Reference: ${src.split('/').pop()}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-[95vw] max-w-6xl max-h-[85vh] bg-[#1A1F2C] rounded-xl shadow-xl flex flex-col z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-2xl font-bold text-white">Reference Gallery</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10 p-2"
              >
                <X size={24} />
              </button>
            </div>

            {/* Grid of Images */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {presetImages.map((preset) => (
                  <motion.div
                    key={preset.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleImageSelect(preset.src)}
                    onMouseEnter={() => setHoveredPreset(preset.id)}
                    onMouseLeave={() => setHoveredPreset(null)}
                    className="relative aspect-video rounded-lg overflow-hidden shadow-lg cursor-pointer bg-black/20"
                  >
                    <img
                      src={preset.src}
                      alt={preset.alt}
                      className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                    />
                    {hoveredPreset === preset.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center p-2 backdrop-blur-[2px]"
                      >
                        <p className="text-white text-sm font-medium text-center">
                          {preset.alt}
                        </p>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GalleryModal;
