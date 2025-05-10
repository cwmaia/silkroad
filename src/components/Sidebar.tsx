import React from 'react';
import { useGameStore } from '../state/gameStore';

const Sidebar: React.FC = () => {
  const { player, cities, travel, currentCity } = useGameStore();
  
  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h1 className="panel-title text-accent-blue terminal-flicker">SilkRoad</h1>
      </div>
      
      <div className="mb-6">
        <div className="text-xs uppercase text-text-secondary mb-2">Operative</div>
        <div className="text-lg font-medium">{player.name || 'Anonymous'}</div>
      </div>
      
      <div className="mb-6">
        <div className="text-xs uppercase text-text-secondary mb-2">Navigation</div>
        <div className="space-y-1">
          {cities.map((city) => (
            <button
              key={city.name}
              onClick={() => city.name !== currentCity.name && travel(city.name)}
              disabled={city.name === currentCity.name}
              className={`w-full text-left px-2 py-1.5 rounded text-sm transition-all flex items-center justify-between ${
                city.name === currentCity.name 
                  ? 'bg-background-light text-accent-blue' 
                  : 'hover:bg-background-light'
              }`}
            >
              <span className="flex items-center">
                <span className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                  city.risk > 0.4 
                    ? 'bg-accent-red' 
                    : city.risk > 0.2 
                    ? 'bg-accent-amber' 
                    : 'bg-accent-green'
                }`}></span>
                {city.name}
              </span>
              {city.name === currentCity.name && (
                <span className="text-xs px-1 bg-accent-blue bg-opacity-20 rounded">CURRENT</span>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <div className="text-xs uppercase text-text-secondary mb-2">Account Status</div>
        <div className="space-y-2">
          <div className="data-card">
            <div className="data-card-header">Cash</div>
            <div className="data-card-value text-accent-green">${player.cash.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-header">Bank</div>
            <div className="data-card-value text-accent-blue">${player.bank.toLocaleString()}</div>
          </div>
          <div className="data-card">
            <div className="data-card-header">Debt</div>
            <div className="data-card-value text-accent-red">${player.debt.toLocaleString()}</div>
          </div>
        </div>
      </div>
      
      <div className="mt-auto text-center text-xs text-text-secondary pt-4 border-t border-border-DEFAULT">
        <div>Day {MAX_DAYS - player.daysLeft + 1} of {MAX_DAYS}</div>
        <div className="mt-1">
          <progress 
            value={MAX_DAYS - player.daysLeft + 1} 
            max={MAX_DAYS} 
            className="w-full h-1 [&::-webkit-progress-bar]:bg-background-light [&::-webkit-progress-value]:bg-accent-blue rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

// Constants
const MAX_DAYS = 30;

export default Sidebar; 