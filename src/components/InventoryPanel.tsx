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
  
  const calculateDrugValue = (drug: Drug): number => {
    if (!drugMarket || !drugMarket[drug]) return 0;
    return drugMarket[drug].price * player.inventory[drug];
  };
  
  const totalValue = calculateTotalValue();
  const totalItems = Object.values(player.inventory).reduce((a, b) => a + b, 0);
  
  // Sort drugs by value (highest first)
  const sortedDrugs = Object.keys(player.inventory)
    .filter(drug => player.inventory[drug as Drug] > 0)
    .sort((a, b) => {
      const drugA = a as Drug;
      const drugB = b as Drug;
      return calculateDrugValue(drugB) - calculateDrugValue(drugA);
    }) as Drug[];
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">INVENTORY</h2>
        <div className="text-xs text-accent-blue">
          {totalItems} items · ${totalValue.toLocaleString()} total
        </div>
      </div>
      
      {totalItems > 0 ? (
        <div className="space-y-2">
          {sortedDrugs.map(drug => {
            const qty = player.inventory[drug];
            const value = calculateDrugValue(drug);
            
            return (
              <div 
                key={drug} 
                className="border border-border-DEFAULT rounded p-2 flex justify-between items-center hover:border-border-highlight transition-all"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-accent-blue mr-2"></div>
                  <span className="font-medium">{drug}</span>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-xs text-text-secondary">Quantity</div>
                    <div className="font-mono">{qty}</div>
                  </div>
                  
                  <div className="text-right min-w-24">
                    <div className="text-xs text-text-secondary">Value</div>
                    <div className="font-mono text-accent-green">${value.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="border-t border-border-DEFAULT mt-4 pt-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Total items:</span>
              <span className="font-mono">{totalItems}</span>
            </div>
            
            <div className="flex justify-between font-medium mt-1">
              <span className="text-text-secondary">Total value:</span>
              <span className="text-accent-green font-mono">${totalValue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center">
          <div className="text-text-secondary mb-2">Your stash is empty</div>
          <div className="text-sm">Visit the market to acquire inventory.</div>
        </div>
      )}
    </div>
  );
};

export default InventoryPanel; 