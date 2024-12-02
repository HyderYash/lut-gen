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
