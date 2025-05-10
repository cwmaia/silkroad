import React from 'react';
import { useGameStore } from '../state/gameStore';
import type { Drug } from '../types/game';

const PlayerStats: React.FC = () => {
  const { player, drugMarket } = useGameStore();
  
  // Calculate total inventory value
  const calculateInventoryValue = (): number => {
    if (!drugMarket || Object.keys(drugMarket).length === 0) {
      return 0;
    }
    
    let total = 0;
    Object.entries(player.inventory).forEach(([drug, qty]) => {
      const drugName = drug as Drug;
      if (qty > 0 && drugMarket[drugName]) {
        total += drugMarket[drugName].price * qty;
      }
    });
    
    return total;
  };
  
  const inventoryValue = calculateInventoryValue();
  const netWorth = player.cash + player.bank - player.debt + inventoryValue;
  
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
      
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex justify-between">
          <p className="text-gray-400">Net Worth:</p>
          <p className={`font-medium ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            ${netWorth.toLocaleString()}
          </p>
        </div>
        <p className="text-xs text-gray-400 mt-1">(Cash + Bank - Debt + Inventory Value)</p>
      </div>
    </div>
  );
};

export default PlayerStats; 