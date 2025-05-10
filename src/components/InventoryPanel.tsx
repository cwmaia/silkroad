import React from 'react';
import { useGameStore } from '../state/gameStore';
import type { Drug } from '../types/game';

const InventoryPanel: React.FC = () => {
  const { player, drugMarket } = useGameStore();
  
  // Calculate total inventory value based on the drug market
  const calculateTotalValue = (): number => {
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
  
  const totalValue = calculateTotalValue();
  const totalItems = Object.values(player.inventory).reduce((a, b) => a + b, 0);
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-2">Inventory</h2>
      
      {totalItems > 0 ? (
        <>
          <div className="mb-4">
            <p className="text-gray-400 mb-2">Your stash:</p>
            <ul className="space-y-1">
              {Object.entries(player.inventory).map(([drug, qty]) => {
                if (qty <= 0) return null;
                return (
                  <li key={drug} className="flex justify-between">
                    <span>{drug}</span>
                    <span className="font-medium">{qty} units</span>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="border-t border-gray-700 pt-3 mt-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total items:</span>
              <span>{totalItems} units</span>
            </div>
            
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-400">Estimated value:</span>
              <span className="text-green-400">${totalValue.toLocaleString()}</span>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-400">You don't have any drugs yet. Visit the market to buy some.</p>
      )}
    </div>
  );
};

export default InventoryPanel; 