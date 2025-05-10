import React from 'react';
import { useGameStore } from '../state/gameStore';

const CitySelector: React.FC = () => {
  const { cities, currentCity, travel, player } = useGameStore();
  
  const handleTravel = (cityName: string) => {
    if (cityName !== currentCity.name) {
      travel(cityName);
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-2">Travel</h2>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-400">Current location: <span className="text-white">{currentCity.name}</span></p>
        <p className="text-gray-400">Days left: <span className="text-white">{player.daysLeft}</span></p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => handleTravel(city.name)}
            disabled={city.name === currentCity.name}
            className={`btn ${
              city.name === currentCity.name
                ? 'bg-blue-900 cursor-not-allowed opacity-50'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {city.name}
            {city.risk > 0.3 && <span className="ml-1 text-red-400">⚠️</span>}
          </button>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>Travel consumes 1 day and will update the drug prices.</p>
        {currentCity.risk > 0.3 && (
          <p className="text-red-400 mt-1">Warning: Higher risk areas have more police presence!</p>
        )}
      </div>
    </div>
  );
};

export default CitySelector; 