import React from 'react';
import { useGameStore } from '../state/gameStore';

const CitySelector: React.FC = () => {
  const { cities, currentCity, travel } = useGameStore();
  
  const handleTravel = (cityName: string) => {
    if (cityName !== currentCity.name) {
      travel(cityName);
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-2">Travel</h2>
      <p className="mb-4 text-gray-400">Current location: <span className="text-white">{currentCity.name}</span></p>
      
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
    </div>
  );
};

export default CitySelector; 