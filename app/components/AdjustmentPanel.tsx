import { useState } from 'react';
import { Adjustments } from '../types/adjustments';
import { RotateCcw } from 'lucide-react';

interface AdjustmentPanelProps {
  adjustments: Adjustments;
  onAdjustmentsChange: (adjustments: Adjustments) => void;
}

export default function AdjustmentPanel({ adjustments, onAdjustmentsChange }: AdjustmentPanelProps) {
  const handleChange = (name: keyof Adjustments, value: number) => {
    onAdjustmentsChange({
      ...adjustments,
      [name]: value,
    });
  };

  const handleReset = () => {
    const resetAdjustments: Adjustments = {
      contrast: 0,
      brightness: 0,
      saturation: 0,
      temperature: 0,
      tint: 0,
      vibrance: 0
    };
    onAdjustmentsChange(resetAdjustments);
  };

  const handleResetIndividual = (name: keyof Adjustments) => {
    onAdjustmentsChange({
      ...adjustments,
      [name]: 0,
    });
  };

  const adjustmentControls = [
    { name: 'contrast', label: 'Contrast' },
    { name: 'brightness', label: 'Brightness' },
    { name: 'saturation', label: 'Saturation' },
    { name: 'temperature', label: 'Temperature' },
    { name: 'tint', label: 'Tint' },
    { name: 'vibrance', label: 'Vibrance' },
  ];

  return (
    <div className="bg-dark-800 rounded-xl p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-white">Fine Tune</h2>
        <button
          onClick={handleReset}
          className="text-gray-400 hover:text-white transition-colors"
          title="Reset All"
        >
          <RotateCcw size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        {adjustmentControls.map(({ name, label }) => (
          <div key={name} className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-gray-300">{label}</label>
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-sm">
                  {adjustments[name as keyof Adjustments]}
                </span>
                <button
                  onClick={() => handleResetIndividual(name as keyof Adjustments)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                  title={`Reset ${label}`}
                >
                  <RotateCcw size={14} />
                </button>
              </div>
            </div>
            <input
              type="range"
              min="-100"
              max="100"
              value={adjustments[name as keyof Adjustments]}
              onChange={(e) => handleChange(name as keyof Adjustments, Number(e.target.value))}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
