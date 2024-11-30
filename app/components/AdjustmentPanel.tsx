import { useState } from 'react';
import { Adjustments } from '../types/adjustments';
import { RefreshCw } from 'lucide-react';

interface AdjustmentPanelProps {
  adjustments: Adjustments;
  onAdjustmentsChange: (adjustments: Adjustments) => void;
}

export default function AdjustmentPanel({ adjustments, onAdjustmentsChange }: AdjustmentPanelProps) {
  const handleChange = (name: keyof Adjustments, value: number) => {
    const newAdjustments = {
      ...adjustments,
      [name]: value
    };
    onAdjustmentsChange(newAdjustments);
  };

  const handleReset = () => {
    const resetAdjustments: Adjustments = {
      contrast: 0,
      brightness: 0,
      saturation: 0,
      temperature: 0,
      tint: 0,
      highlights: 0,
      shadows: 0,
      vibrance: 0
    };
    onAdjustmentsChange(resetAdjustments);
  };

  return (
    <div className="bg-dark-800 rounded-xl p-6 flex-1">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">Fine-tune Adjustments</h2>
        <button 
          onClick={handleReset}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <RefreshCw size={16} />
          Reset All
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {Object.entries(adjustments).map(([name, value]) => (
          <div key={name} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-gray-300 capitalize">{name}</label>
              <span className="text-gray-400">{value}</span>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={value}
              onChange={(e) => handleChange(name as keyof Adjustments, Number(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
