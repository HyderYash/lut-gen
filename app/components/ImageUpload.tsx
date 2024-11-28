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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const checkScrollButtons = useCallback(() => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      sliderRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  React.useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollButtons);
      checkScrollButtons();
      return () => slider.removeEventListener('scroll', checkScrollButtons);
    }
  }, [checkScrollButtons]);

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
                className="relative mb-6"
              >
                {/* Navigation Buttons Container */}
                <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none z-10">
                  {/* Left Button */}
                  <AnimatePresence>
                    {canScrollLeft && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => scrollSlider('left')}
                        className="pointer-events-auto ml-2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all hover:scale-110 backdrop-blur-sm"
                      >
                        <ChevronLeft className="text-white w-5 h-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Right Button */}
                  <AnimatePresence>
                    {canScrollRight && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => scrollSlider('right')}
                        className="pointer-events-auto mr-2 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-all hover:scale-110 backdrop-blur-sm"
                      >
                        <ChevronRight className="text-white w-5 h-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Preset Images Slider */}
                <div
                  ref={sliderRef}
                  className="hide-scrollbar relative flex gap-4 overflow-x-auto max-w-full px-2 py-2 -mx-2"
                  style={{
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  <div className="flex gap-4 min-w-max">
                    {shuffledPresets.map((preset) => (
                      <motion.div
                        key={preset.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onImageSelect(preset.src)}
                        onMouseEnter={() => setHoveredPreset(preset.id)}
                        onMouseLeave={() => setHoveredPreset(null)}
                        className="relative flex-shrink-0 w-48 h-32 rounded-lg overflow-hidden shadow-lg cursor-pointer"
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
                </div>
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
              className="absolute top-4 right-4 bg-black/50 rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <X className="text-white" size={20} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ImageUpload;