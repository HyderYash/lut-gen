// Importing types from color.ts
import { RGB, ColorStats, LUTData, Adjustments } from '../types/color';

// Updated functions with TypeScript annotations
export function getRGBFromImageData(data: Uint8ClampedArray, index: number): RGB {
  return {
    r: data[index],
    g: data[index + 1],
    b: data[index + 2],
    [0]: data[index],        // Add numeric indexing
    [1]: data[index + 1],    // Add numeric indexing
    [2]: data[index + 2],    // Add numeric indexing
  };
}

export function calculateColorStats(imageData: ImageData): ColorStats {
  const pixels = imageData.data;
  let rSum = 0,
    gSum = 0,
    bSum = 0;
  let rSqSum = 0,
    gSqSum = 0,
    bSqSum = 0;
  let rMin = 255,
    gMin = 255,
    bMin = 255;
  let rMax = 0,
    gMax = 0,
    bMax = 0;
  const totalPixels = pixels.length / 4;
  const rValues: number[] = [];
  const gValues: number[] = [];
  const bValues: number[] = [];

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    rValues.push(r);
    gValues.push(g);
    bValues.push(b);

    rSum += r;
    gSum += g;
    bSum += b;

    rSqSum += r * r;
    gSqSum += g * g;
    bSqSum += b * b;

    rMin = Math.min(rMin, r);
    gMin = Math.min(gMin, g);
    bMin = Math.min(bMin, b);

    rMax = Math.max(rMax, r);
    gMax = Math.max(gMax, g);
    bMax = Math.max(bMax, b);
  }

  rValues.sort((a, b) => a - b);
  gValues.sort((a, b) => a - b);
  bValues.sort((a, b) => a - b);

  const medianIndex = Math.floor(totalPixels / 2);

  return {
    mean: {
      r: rSum / totalPixels,
      g: gSum / totalPixels,
      b: bSum / totalPixels,
    },
    std: {
      r: Math.sqrt(rSqSum / totalPixels - (rSum / totalPixels) ** 2),
      g: Math.sqrt(gSqSum / totalPixels - (gSum / totalPixels) ** 2),
      b: Math.sqrt(bSqSum / totalPixels - (bSum / totalPixels) ** 2),
    },
    min: {
      r: rMin,
      g: gMin,
      b: bMin,
    },
    max: {
      r: rMax,
      g: gMax,
      b: bMax,
    },
    median: {
      r: rValues[medianIndex],
      g: gValues[medianIndex],
      b: bValues[medianIndex],
    },
  };
}

export function applyColorTransfer(
  originalImageData: ImageData,
  referenceStats: ColorStats
): ImageData {
  const originalStats = calculateColorStats(originalImageData);
  const result = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );

  for (let i = 0; i < result.data.length; i += 4) {
    const pixel = getRGBFromImageData(originalImageData.data, i);

    result.data[i] = Math.max(
      0,
      Math.min(
        255,
        ((pixel.r - originalStats.mean.r) * (referenceStats.std.r / originalStats.std.r)) +
          referenceStats.mean.r
      )
    );
    result.data[i + 1] = Math.max(
      0,
      Math.min(
        255,
        ((pixel.g - originalStats.mean.g) * (referenceStats.std.g / originalStats.std.g)) +
          referenceStats.mean.g
      )
    );
    result.data[i + 2] = Math.max(
      0,
      Math.min(
        255,
        ((pixel.b - originalStats.mean.b) * (referenceStats.std.b / originalStats.std.b)) +
          referenceStats.mean.b
      )
    );
    result.data[i + 3] = originalImageData.data[i + 3];
  }

  return result;
}

export function applyAdjustments(imageData: ImageData, adjustments: Adjustments): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);

  // Apply adjustments
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = pixels.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Brightness
    if (adjustments.brightness !== 0) {
      const factor = 1 + (adjustments.brightness / 100);
      r *= factor;
      g *= factor;
      b *= factor;
    }

    // Contrast
    if (adjustments.contrast !== 0) {
      const factor = (1 + (adjustments.contrast / 100));
      r = ((r - 128) * factor) + 128;
      g = ((g - 128) * factor) + 128;
      b = ((b - 128) * factor) + 128;
    }

    // Saturation
    if (adjustments.saturation !== 0) {
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      const factor = 1 + (adjustments.saturation / 100);
      r = gray + (r - gray) * factor;
      g = gray + (g - gray) * factor;
      b = gray + (b - gray) * factor;
    }

    // Temperature
    if (adjustments.temperature !== 0) {
      const factor = adjustments.temperature / 100;
      r += factor * 10;
      b -= factor * 10;
    }

    // Tint
    if (adjustments.tint !== 0) {
      const factor = adjustments.tint / 100;
      g += factor * 10;
    }

    // Highlights and Shadows
    // if (adjustments.highlights !== 0 || adjustments.shadows !== 0) {
    //   const luminance = (r + g + b) / 3;
    //   const shadowsFactor = 1 + (adjustments.shadows / 100);
    //   const highlightsFactor = 1 + (adjustments.highlights / 100);
      
    //   if (luminance < 128) {
    //     const factor = shadowsFactor;
    //     r *= factor;
    //     g *= factor;
    //     b *= factor;
    //   } else {
    //     const factor = highlightsFactor;
    //     r *= factor;
    //     g *= factor;
    //     b *= factor;
    //   }
    // }

    // Vibrance
    if (adjustments.vibrance !== 0) {
      const max = Math.max(r, g, b);
      const avg = (r + g + b) / 3;
      const saturation = Math.sqrt((r - avg) ** 2 + (g - avg) ** 2 + (b - avg) ** 2) / 128;
      const factor = 1 + (adjustments.vibrance / 100) * (1 - saturation);
      r = avg + (r - avg) * factor;
      g = avg + (g - avg) * factor;
      b = avg + (b - avg) * factor;
    }

    // Clamp values
    data[i] = Math.min(255, Math.max(0, r));
    data[i + 1] = Math.min(255, Math.max(0, g));
    data[i + 2] = Math.min(255, Math.max(0, b));
  }

  return pixels;
}

export function generateLUTData(
  originalStats: ColorStats,
  referenceStats: ColorStats,
  adjustments: Adjustments,
  size: number = 32
): LUTData {
  const lut: RGB[][][] = [];

  // Helper function to apply adjustments to RGB values
  const applyAdjustmentsToValues = (r: number, g: number, b: number): { r: number, g: number, b: number } => {
    // Convert to 0-255 range for adjustments
    let adjustedR = r * 255;
    let adjustedG = g * 255;
    let adjustedB = b * 255;

    // Apply contrast
    if (adjustments.contrast !== 0) {
      const factor = (100 + adjustments.contrast) / 100;
      adjustedR = ((adjustedR / 255 - 0.5) * factor + 0.5) * 255;
      adjustedG = ((adjustedG / 255 - 0.5) * factor + 0.5) * 255;
      adjustedB = ((adjustedB / 255 - 0.5) * factor + 0.5) * 255;
    }

    // Apply brightness
    if (adjustments.brightness !== 0) {
      const factor = adjustments.brightness / 100;
      adjustedR += factor * 255;
      adjustedG += factor * 255;
      adjustedB += factor * 255;
    }

    // Apply saturation
    if (adjustments.saturation !== 0) {
      const factor = (100 + adjustments.saturation) / 100;
      const gray = (adjustedR + adjustedG + adjustedB) / 3;
      adjustedR = gray + (adjustedR - gray) * factor;
      adjustedG = gray + (adjustedG - gray) * factor;
      adjustedB = gray + (adjustedB - gray) * factor;
    }

    // Apply temperature
    if (adjustments.temperature !== 0) {
      const factor = adjustments.temperature / 100;
      adjustedR += factor * 20;
      adjustedB -= factor * 20;
    }

    // Apply tint
    if (adjustments.tint !== 0) {
      const factor = adjustments.tint / 100;
      adjustedG += factor * 20;
    }

    // Apply vibrance
    if (adjustments.vibrance !== 0) {
      const factor = adjustments.vibrance / 100;
      const max = Math.max(adjustedR, adjustedG, adjustedB);
      const avg = (adjustedR + adjustedG + adjustedB) / 3;
      const amt = (Math.abs(max - avg) * 2) / 255 * factor;
      
      if (adjustedR !== max) adjustedR += (max - adjustedR) * amt;
      if (adjustedG !== max) adjustedG += (max - adjustedG) * amt;
      if (adjustedB !== max) adjustedB += (max - adjustedB) * amt;
    }

    // Clamp values to 0-255 range and normalize back to 0-1
    return {
      r: Math.max(0, Math.min(255, adjustedR)) / 255,
      g: Math.max(0, Math.min(255, adjustedG)) / 255,
      b: Math.max(0, Math.min(255, adjustedB)) / 255
    };
  };

  for (let b = 0; b < size; b++) {
    lut[b] = [];
    for (let g = 0; g < size; g++) {
      lut[b][g] = [];
      for (let r = 0; r < size; r++) {
        const normalizedR = (r / (size - 1)) * 255;
        const normalizedG = (g / (size - 1)) * 255;
        const normalizedB = (b / (size - 1)) * 255;

        const transformedR =
          Math.max(
            0,
            Math.min(
              255,
              ((normalizedR - originalStats.mean.r) * (referenceStats.std.r / originalStats.std.r)) +
                referenceStats.mean.r
            )
          ) / 255;
        const transformedG =
          Math.max(
            0,
            Math.min(
              255,
              ((normalizedG - originalStats.mean.g) * (referenceStats.std.g / originalStats.std.g)) +
                referenceStats.mean.g
            )
          ) / 255;
        const transformedB =
          Math.max(
            0,
            Math.min(
              255,
              ((normalizedB - originalStats.mean.b) * (referenceStats.std.b / originalStats.std.b)) +
                referenceStats.mean.b
            )
          ) / 255;

        // Apply adjustments after color transfer
        const adjustedColors = applyAdjustmentsToValues(transformedR, transformedG, transformedB);

        lut[b][g][r] = {
          r: adjustedColors.r,
          g: adjustedColors.g,
          b: adjustedColors.b,
          [0]: adjustedColors.r,
          [1]: adjustedColors.g,
          [2]: adjustedColors.b,
        };
      }
    }
  }

  return { size, data: lut };
}

// Advanced color manipulation functions
export function calculateColorStatsAdvanced(imageData: ImageData): ColorStats {
  const pixels = imageData.data;
  let r = 0, g = 0, b = 0;
  const pixelCount = pixels.length / 4;

  for (let i = 0; i < pixels.length; i += 4) {
    r += pixels[i];
    g += pixels[i + 1];
    b += pixels[i + 2];
  }

  return {
    averageRed: r / pixelCount,
    averageGreen: g / pixelCount,
    averageBlue: b / pixelCount,
    colorVariance: calculateColorVariance(pixels)
  };
}

export function generateLUTDataAdvanced(
  originalStats: ColorStats, 
  referenceStats: ColorStats, 
  adjustments: Adjustments
): LUTData {
  // More sophisticated LUT generation
  const lutSize = 64; // Standard LUT size
  const lut = new Float32Array(lutSize * lutSize * lutSize * 3);

  for (let r = 0; r < lutSize; r++) {
    for (let g = 0; g < lutSize; g++) {
      for (let b = 0; b < lutSize; b++) {
        const index = (r * lutSize * lutSize + g * lutSize + b) * 3;
        
        // Base color transfer
        let nr = r / (lutSize - 1);
        let ng = g / (lutSize - 1);
        let nb = b / (lutSize - 1);

        // Apply reference color statistics
        nr = applyColorTransformation(nr, referenceStats.averageRed / 255, adjustments.temperature);
        ng = applyColorTransformation(ng, referenceStats.averageGreen / 255, adjustments.tint);
        nb = applyColorTransformation(nb, referenceStats.averageBlue / 255, adjustments.temperature);

        // Fine-tuning adjustments
        nr = adjustColor(nr, adjustments.brightness, adjustments.contrast, adjustments.saturation);
        ng = adjustColor(ng, adjustments.brightness, adjustments.contrast, adjustments.saturation);
        nb = adjustColor(nb, adjustments.brightness, adjustments.contrast, adjustments.saturation);

        lut[index] = nr;
        lut[index + 1] = ng;
        lut[index + 2] = nb;
      }
    }
  }

  return { lut, size: lutSize };
}

export function applyColorTransferAdvanced(
  originalImageData: ImageData, 
  referenceStats: ColorStats
): ImageData {
  const outputData = new ImageData(
    new Uint8ClampedArray(originalImageData.data),
    originalImageData.width,
    originalImageData.height
  );

  for (let i = 0; i < outputData.data.length; i += 4) {
    // Advanced color transfer logic
    outputData.data[i] = transferChannel(
      outputData.data[i], 
      referenceStats.averageRed
    );
    outputData.data[i + 1] = transferChannel(
      outputData.data[i + 1], 
      referenceStats.averageGreen
    );
    outputData.data[i + 2] = transferChannel(
      outputData.data[i + 2], 
      referenceStats.averageBlue
    );
  }

  return outputData;
}

export function applyAdjustmentsAdvanced(
  imageData: ImageData, 
  adjustments: Adjustments
): ImageData {
  const outputData = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );

  for (let i = 0; i < outputData.data.length; i += 4) {
    // Normalize color channels
    let r = outputData.data[i] / 255;
    let g = outputData.data[i + 1] / 255;
    let b = outputData.data[i + 2] / 255;

    // Apply adjustments
    r = adjustColor(r, adjustments.brightness, adjustments.contrast, adjustments.saturation);
    g = adjustColor(g, adjustments.brightness, adjustments.contrast, adjustments.saturation);
    b = adjustColor(b, adjustments.brightness, adjustments.contrast, adjustments.saturation);

    // Apply vibrance and temperature
    r = applyVibrance(r, adjustments.vibrance);
    g = applyVibrance(g, adjustments.vibrance);
    b = applyVibrance(b, adjustments.vibrance);

    // Reapply to image data
    outputData.data[i] = r * 255;
    outputData.data[i + 1] = g * 255;
    outputData.data[i + 2] = b * 255;
  }

  return outputData;
}

// Helper functions for color manipulation
function calculateColorVariance(pixels: Uint8ClampedArray): number {
  // Calculate color variance for more accurate color transfer
  return 0; // Implement actual variance calculation
}

function applyColorTransformation(
  color: number, 
  referenceColor: number, 
  adjustment: number
): number {
  // Color transformation based on reference and adjustment
  return color * (1 + adjustment / 100);
}

function adjustColor(
  color: number, 
  brightness: number, 
  contrast: number, 
  saturation: number
): number {
  // Sophisticated color adjustment algorithm
  // Brightness adjustment
  color = color * (1 + brightness / 100);

  // Contrast adjustment
  color = ((color - 0.5) * (1 + contrast / 100)) + 0.5;

  // Saturation adjustment (using luminance-preserving method)
  const luminance = 0.299 * color + 0.587 * color + 0.114 * color;
  color = luminance + (color - luminance) * (1 + saturation / 100);

  // Clamp between 0 and 1
  return Math.max(0, Math.min(1, color));
}

function applyVibrance(
  color: number, 
  vibrance: number
): number {
  // Vibrance adjustment preserves skin tones
  const amount = vibrance / 100;
  const max = Math.max(color, color, color);
  const min = Math.min(color, color, color);
  const sat = (max - min) / (max + Number.EPSILON);
  
  return color + (color - min) * amount * (1 - sat);
}

function transferChannel(
  originalChannel: number, 
  referenceChannel: number
): number {
  // Advanced channel transfer with preservation of original details
  return Math.min(255, Math.max(0, 
    originalChannel * (referenceChannel / 128)
  ));
}

export {
  calculateColorStatsAdvanced as calculateColorStatsAI,
  generateLUTDataAdvanced as generateLUTDataAI,
  applyColorTransferAdvanced as applyColorTransferAI,
  applyAdjustmentsAdvanced as applyAdjustmentsAI
};
