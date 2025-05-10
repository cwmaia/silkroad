import React, { useState } from 'react';
import { useGameStore } from '../state/gameStore';
import type { City } from '../types/game';

const CitySelector: React.FC = () => {
  const { travel, cities, currentCity, player } = useGameStore();
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  
  const handleTravel = (city: City) => {
    if (city.name !== player.location) {
      travel(city.name);
    }
  };
  
  const getRiskIndicator = (risk: number) => {
    if (risk >= 0.4) return { emoji: '🔴', label: 'HIGH RISK', color: 'text-red-400' };
    if (risk >= 0.2) return { emoji: '🟡', label: 'MEDIUM RISK', color: 'text-yellow-400' };
    return { emoji: '🟢', label: 'LOW RISK', color: 'text-green-400' };
  };
  
  const getCityStats = (city: City) => {
    // Get the number of drug types with modifiers in this city
    const specialtyCount = city.modifiers ? Object.keys(city.modifiers).length : 0;
    
    // Get the drugs with the best discounts
    const specialties = city.modifiers 
      ? Object.entries(city.modifiers)
        .sort(([, valueA], [, valueB]) => (valueA as number) - (valueB as number))
        .slice(0, 2)
        .map(([drug]) => drug)
      : [];
      
    return {
      specialtyCount,
      specialties,
      riskIndicator: getRiskIndicator(city.risk),
      hasPolice: city.risk > 0.3,
      marketVolatility: city.risk > 0.25 ? 'High' : 'Stable'
    };
  };
  
  return (
    <div className="bg-zinc-900 rounded shadow-md border border-zinc-700 overflow-hidden">
      <div className="p-3 text-sm border-b border-zinc-700 bg-zinc-800 flex justify-between items-center">
        <div className="font-medium">TRAVEL</div>
        <div className="text-xs text-gray-400">Current: {currentCity.name}</div>
      </div>
      
      <div className="p-2">
        <div className="grid grid-cols-2 gap-2">
          {cities.map(city => {
            const isCurrentLocation = city.name === player.location;
            const cityStats = getCityStats(city);
            
            return (
              <div 
                key={city.name}
                className={`
                  p-2 rounded border transition-all relative
                  ${isCurrentLocation 
                    ? 'border-blue-400 bg-blue-500 bg-opacity-10' 
                    : 'border-zinc-700 hover:border-zinc-500'}
                `}
                onClick={() => !isCurrentLocation && handleTravel(city)}
                onMouseEnter={() => setShowTooltip(city.name)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <div className="flex justify-between items-center">
                  <div className="font-medium">
                    {cityStats.riskIndicator.emoji} {city.name}
                  </div>
                  {isCurrentLocation && (
                    <span className="text-xs text-blue-400 px-1.5 py-0.5 rounded-full bg-blue-400 bg-opacity-10 border border-blue-400">
                      HERE
                    </span>
                  )}
                </div>
                
                <div className="text-xs text-gray-400 mt-1 flex items-center">
                  <span className={cityStats.riskIndicator.color}>
                    {cityStats.riskIndicator.label}
                  </span>
                  {cityStats.specialtyCount > 0 && (
                    <span className="ml-2 text-green-400">
                      • {cityStats.specialtyCount} discount{cityStats.specialtyCount > 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                
                {showTooltip === city.name && (
                  <div className="absolute z-10 bg-zinc-800 border border-zinc-600 rounded p-2 shadow-lg text-xs left-0 right-0 mt-1 w-56">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Police activity:</span>
                      <span className={cityStats.hasPolice ? "text-red-400" : "text-green-400"}>
                        {cityStats.hasPolice ? "Active" : "Minimal"}
                      </span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-400">Market volatility:</span>
                      <span className={cityStats.marketVolatility === "High" ? "text-yellow-400" : "text-blue-400"}>
                        {cityStats.marketVolatility}
                      </span>
                    </div>
                    {cityStats.specialties.length > 0 && (
                      <div className="mt-1 pt-1 border-t border-zinc-700">
                        <span className="text-gray-400">Best deals on:</span>
                        <div className="mt-0.5">
                          {cityStats.specialties.map(drug => (
                            <span key={drug} className="inline-block mr-1 px-1 bg-green-900 text-green-300 rounded">
                              {drug}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CitySelector; 