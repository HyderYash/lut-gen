'use client';

import React from 'react';

const companies = [
  {
    name: 'DaVinci Resolve',
    logo: '/company-logos/davinci.png',
  },
  {
    name: 'Filmora',
    logo: '/company-logos/filmora.png',
  },
  {
    name: 'Premiere Pro',
    logo: '/company-logos/premiere.png',
  },
  {
    name: 'After Effects',
    logo: '/company-logos/aftereffects.png',
  },
  {
    name: 'Adobe',
    logo: '/company-logos/adobe.png',
  },
  {
    name: 'CapCut',
    logo: '/company-logos/capcut.png',
  },
  {
    name: 'Final Cut Pro',
    logo: '/company-logos/finalcut.png',
  },
  {
    name: 'Avid',
    logo: '/company-logos/avid.png',
  },
];

const CompanySlider = () => {
  return (
    <div className="w-full py-12 mt-8">
      <div className="max-w-7xl mx-auto">
        <h3 className="text-center text-lg font-medium text-gray-300 mb-8">
          <span className="text-primary-light">Trusted</span> by editors worldwide
        </h3>
        
        <div className="relative w-full overflow-hidden">
          <style jsx>{`
            @keyframes scroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.33%); }
            }
            .slider {
              display: flex;
              width: max-content;
              animation: scroll 25s linear infinite;
            }
            .slider:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="slider">
            {/* First set of logos */}
            {companies.map((company, index) => (
              <div
                key={`${company.name}-${index}-1`}
                className="inline-flex flex-col items-center mx-6 group"
              >
                <div className="w-20 h-20 flex items-center justify-center p-3 rounded-lg bg-dark-900/30 backdrop-blur-sm border border-white/5 group-hover:border-primary/20 transition-all duration-300">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-3 group-hover:text-primary-light transition-colors duration-300">
                  {company.name}
                </span>
              </div>
            ))}
            {/* Second set of logos */}
            {companies.map((company, index) => (
              <div
                key={`${company.name}-${index}-2`}
                className="inline-flex flex-col items-center mx-6 group"
              >
                <div className="w-20 h-20 flex items-center justify-center p-3 rounded-lg bg-dark-900/30 backdrop-blur-sm border border-white/5 group-hover:border-primary/20 transition-all duration-300">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-3 group-hover:text-primary-light transition-colors duration-300">
                  {company.name}
                </span>
              </div>
            ))}
            {/* Third set of logos */}
            {companies.map((company, index) => (
              <div
                key={`${company.name}-${index}-3`}
                className="inline-flex flex-col items-center mx-6 group"
              >
                <div className="w-20 h-20 flex items-center justify-center p-3 rounded-lg bg-dark-900/30 backdrop-blur-sm border border-white/5 group-hover:border-primary/20 transition-all duration-300">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <span className="text-xs text-gray-500 mt-3 group-hover:text-primary-light transition-colors duration-300">
                  {company.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySlider;
