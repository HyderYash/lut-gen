"use client"
import React, { useCallback, useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  title: string;
  image: string | null;
  onImageSelect: (image: string) => void;
  onImageRemove: () => void;
  presetImages?: Array<{ id: string; src: string; alt: string }>;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  title,
  image,
  onImageSelect,
  onImageRemove,
  presetImages = [],
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onImageSelect(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onImageSelect]);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Shuffle presets array
  const shuffledPresets = React.useMemo(() => {
    return [...presetImages].sort(() => Math.random() - 0.5);
  }, [presetImages]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black/20 backdrop-blur-sm rounded-xl shadow-xl p-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
        {presetImages.length > 0 && (
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="text-primary hover:text-primary-light transition-colors"
          >
            <ImageIcon size={24} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!image ? (
          <>
            {showPresets && presetImages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="relative"
              >
                {/* Scroll Left Button */}
                <button
                  onClick={() => scrollSlider('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
                >
                  <ChevronLeft className="text-white" size={24} />
                </button>

                {/* Preset Images Slider */}
                <div
                  ref={sliderRef}
                  className="flex overflow-x-scroll scrollbar-hide space-x-4 pb-4 px-10"
                  style={{
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {shuffledPresets.map((preset) => (
                    <motion.div
                      key={preset.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onImageSelect(preset.src)}
                      onMouseEnter={() => setHoveredPreset(preset.id)}
                      onMouseLeave={() => setHoveredPreset(null)}
                      className="flex-shrink-0 w-48 h-32 cursor-pointer rounded-lg overflow-hidden shadow-lg scroll-snap-align-center relative"
                      style={{ scrollSnapAlign: 'center' }}
                    >
                      <img
                        src={preset.src}
                        alt={preset.alt}
                        className="w-full h-full object-cover"
                      />
                      {hoveredPreset === preset.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center p-2"
                        >
                          <p className="text-white text-sm font-medium text-center">
                            {preset.alt}
                          </p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Scroll Right Button */}
                <button
                  onClick={() => scrollSlider('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
                >
                  <ChevronRight className="text-white" size={24} />
                </button>
              </motion.div>
            )}

            {/* Upload Area */}
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ${
                !image ? 'border-gray-700 hover:border-primary hover:bg-primary/5' : ''
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id={`file-${title}`}
              />
              <label
                htmlFor={`file-${title}`}
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-primary mb-4" />
                <p className="text-gray-200 font-medium mb-2">
                  Drag and drop your image here
                </p>
                <p className="text-gray-400 text-sm">
                  or click to browse
                </p>
              </label>
            </motion.div>
          </>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative rounded-lg overflow-hidden"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-64 object-cover"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onImageRemove}
              className="absolute top-2 right-2 bg-black/75 text-white p-2 rounded-full hover:bg-black transition-colors"
            >
              <X size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageUpload;