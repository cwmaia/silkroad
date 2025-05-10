import React from 'react';
import { useGameStore } from '../state/gameStore';

const PlayerStats: React.FC = () => {
  const { player } = useGameStore();
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-2">Player Stats</h2>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-gray-400">Name</p>
          <p className="font-medium">{player.name || 'Anonymous'}</p>
        </div>
        <div>
          <p className="text-gray-400">Location</p>
          <p className="font-medium">{player.location}</p>
        </div>
        <div>
          <p className="text-gray-400">Cash</p>
          <p className="font-medium text-green-400">${player.cash.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400">Bank</p>
          <p className="font-medium text-blue-400">${player.bank.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400">Debt</p>
          <p className="font-medium text-red-400">${player.debt.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-400">Days Left</p>
          <p className="font-medium">{player.daysLeft}</p>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats; 