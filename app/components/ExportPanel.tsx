import { Download } from 'lucide-react';

interface ExportPanelProps {
  onExport: () => void;
}

export default function ExportPanel({ onExport }: ExportPanelProps) {
  return (
    <div className="bg-dark-800 rounded-xl p-6 w-80">
      <h2 className="text-lg font-semibold text-white mb-6">Export LUT</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-gray-300 block mb-2">Format</label>
          <div className="relative">
            <select 
              className="w-full bg-[#1A1F2C] text-gray-300 rounded-lg p-3 border border-gray-700/50 hover:border-gray-600 transition-colors appearance-none"
              defaultValue=".cube"
            >
              <option value=".cube">.cube</option>
              <option value=".3dl">.3dl</option>
              <option value=".look">.look</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={onExport}
          className="w-full bg-[#00FF66]/90 hover:bg-[#00FF66] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <Download size={20} />
          Export LUT
        </button>
      </div>
    </div>
  );
}
