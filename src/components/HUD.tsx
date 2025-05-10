import React from 'react';
import { useGameStore } from '../state/gameStore';
import type { Drug } from '../types/game';

const HUD: React.FC = () => {
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
    <div className="fixed bottom-0 left-0 right-0 bg-background-panel border-t border-border-DEFAULT px-4 py-2 z-50">
      <div className="container mx-auto flex justify-between items-center text-xs font-mono">
        <div className="flex space-x-6">
          <div>
            <span className="text-text-secondary">CASH:</span>
            <span className="ml-2 text-accent-green">${player.cash.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-text-secondary">BANK:</span>
            <span className="ml-2 text-accent-blue">${player.bank.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-text-secondary">DEBT:</span>
            <span className="ml-2 text-accent-red">${player.debt.toLocaleString()}</span>
          </div>
          <div>
            <span className="text-text-secondary">STASH VALUE:</span>
            <span className="ml-2 text-accent-amber">${inventoryValue.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="flex space-x-6">
          <div>
            <span className="text-text-secondary">LOCATION:</span>
            <span className="ml-2">{player.location}</span>
          </div>
          <div>
            <span className="text-text-secondary">DAYS LEFT:</span>
            <span className="ml-2">{player.daysLeft}</span>
          </div>
          <div>
            <span className="text-text-secondary">NET WORTH:</span>
            <span className={`ml-2 ${netWorth >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              ${netWorth.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUD; 