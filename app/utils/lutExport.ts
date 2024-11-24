import { LUTData } from '../types/color';
import JSZip from 'jszip';

export function generateCubeLUT(lutData: LUTData): string {
  const { size, data } = lutData;
  let content = `# Generated by LUT Generator Pro\n`;
  content += `LUT_3D_SIZE ${size}\n\n`;

  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {
        const [rr, gg, bb] = data[b][g][r];
        content += `${rr.toFixed(6)} ${gg.toFixed(6)} ${bb.toFixed(6)}\n`;
      }
    }
  }

  return content;
}

export function generate3dlLUT(lutData: LUTData): string {
  const { size, data } = lutData;
  let content = `# Generated by LUT Generator Pro\n`;
  content += `3DMESH\nMeshes ${size} ${size} ${size}\n\n`;

  for (let b = 0; b < size; b++) {
    for (let g = 0; g < size; g++) {
      for (let r = 0; r < size; r++) {
        const [rr, gg, bb] = data[b][g][r];
        content += `${Math.round(rr * 1023)} ${Math.round(gg * 1023)} ${Math.round(bb * 1023)}\n`;
      }
    }
  }

  return content;
}

export function generateLookLUT(lutData: LUTData): string {
  const { size, data } = lutData;
  const metadata = {
    creator: "LUT Generator Pro",
    created: new Date().toISOString(),
    description: "Custom color grading LUT",
    format: "3D",
    size: size,
  };

  let content = JSON.stringify({
    metadata,
    lut: data
  }, null, 2);

  return content;
}

export async function createLUTZipFile(lutData: LUTData): Promise<Blob> {
  const zip = new JSZip();
  
  // Add different LUT formats to the zip
  zip.file("lut.cube", generateCubeLUT(lutData));
  zip.file("lut.3dl", generate3dlLUT(lutData));
  zip.file("lut.look", generateLookLUT(lutData));
  
  // Add readme
  zip.file("README.txt", 
    "LUT Generator Pro - Custom Color Grading LUT\n\n" +
    "This package contains your custom LUT in multiple formats:\n\n" +
    "- lut.cube: Industry standard format (DaVinci Resolve, Adobe products)\n" +
    "- lut.3dl: High-end color grading format\n" +
    "- lut.look: Advanced format with metadata\n\n" +
    "Generated on: " + new Date().toLocaleString()
  );
  
  return await zip.generateAsync({ type: "blob" });
}