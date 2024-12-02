export interface RGB {
  r: number
  g: number
  b: number
  [key: number]: number // Allow numeric indexing
}

export interface HSL {
  h: number
  s: number
  l: number
}

export interface ColorAdjustments {
  brightness: number
  contrast: number
  saturation: number
  temperature: number
  tint: number
  // highlights: number
  // shadows: number
}

export interface ColorStats {
  min: RGB
  max: RGB
  mean: RGB
  median: RGB
  std: RGB
}

export interface LUTData {
  size: number
  data: RGB[][][]
}

export interface RGBColor {
  r: number
  g: number
  b: number
}
