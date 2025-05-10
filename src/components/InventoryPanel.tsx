import React from 'react';
import { useGameStore } from '../state/gameStore';
import type { Drug } from '../types/game';

// Assign weight values to each drug type for simulation purposes
const DRUG_WEIGHTS: Record<Drug, number> = {
  'Cocaine': 1.0,   // 1.0 kg per unit
  'Heroin': 0.8,    // 0.8 kg per unit
  'Acid': 0.01,     // 10 grams per unit
  'Weed': 0.5,      // 500 grams per unit
  'Speed': 0.1,     // 100 grams per unit
  'Ludes': 0.05     // 50 grams per unit
};

// Assign risk factor to each drug type
const DRUG_RISK: Record<Drug, number> = {
  'Cocaine': 8,    // High risk
  'Heroin': 10,    // Highest risk
  'Acid': 6,       // Medium-high risk
  'Weed': 3,       // Low-medium risk  
  'Speed': 5,      // Medium risk
  'Ludes': 2       // Low risk
};

const InventoryPanel: React.FC = () => {
  const { player, drugMarket } = useGameStore();
  
  // Calculate total inventory items
  const totalItems = Object.values(player.inventory).reduce((acc, count) => acc + count, 0);
  
  // Calculate total inventory value
  const calculateInventoryValue = () => {
    return Object.entries(player.inventory).reduce((acc, [drug, count]) => {
      const drugName = drug as Drug;
      if (count > 0 && drugMarket[drugName]) {
        return acc + (drugMarket[drugName].price * count);
      }
      return acc;
    }, 0);
  };
  
  // Calculate total weight of inventory
  const calculateTotalWeight = () => {
    return Object.entries(player.inventory).reduce((acc, [drug, count]) => {
      const drugName = drug as Drug;
      return acc + (DRUG_WEIGHTS[drugName] * count);
    }, 0);
  };
  
  // Calculate risk level (higher number = higher risk)
  const calculateRiskLevel = () => {
    const totalRisk = Object.entries(player.inventory).reduce((acc, [drug, count]) => {
      const drugName = drug as Drug;
      return acc + (DRUG_RISK[drugName] * count);
    }, 0);
    
    // Risk levels: 0-10: Low, 11-50: Medium, 51+: High
    if (totalRisk === 0) return { level: 'NONE', color: 'text-gray-400' };
    if (totalRisk <= 10) return { level: 'LOW', color: 'text-green-400' };
    if (totalRisk <= 50) return { level: 'MEDIUM', color: 'text-yellow-400' };
    return { level: 'HIGH', color: 'text-red-400' };
  };
  
  // Simulate inventory capacity
  const MAX_CAPACITY = 50; // kg
  const currentWeight = calculateTotalWeight();
  const capacityPercentage = (currentWeight / MAX_CAPACITY) * 100;
  const capacityStatus = 
    capacityPercentage < 50 ? { color: 'text-green-400', text: 'GOOD' } : 
    capacityPercentage < 80 ? { color: 'text-yellow-400', text: 'FILLING' } : 
    capacityPercentage < 100 ? { color: 'text-red-400', text: 'ALMOST FULL' } : 
    { color: 'text-red-400 animate-pulse', text: 'OVERENCUMBERED' };
  
  const totalValue = calculateInventoryValue();
  const riskLevel = calculateRiskLevel();
  
  const formatWeight = (weight: number) => {
    if (weight >= 1) {
      return `${weight.toFixed(1)} kg`;
    } else {
      return `${(weight * 1000).toFixed(0)} g`;
    }
  };
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title text-shadow-glow">INVENTORY</h2>
        <div className={`text-xs flex gap-2 items-center ${capacityStatus.color}`}>
          <span>{capacityStatus.text}</span>
          <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full ${
                capacityPercentage < 50 ? 'bg-green-400' : 
                capacityPercentage < 80 ? 'bg-yellow-400' : 
                'bg-red-400'
              }`} 
              style={{ width: `${Math.min(capacityPercentage, 100)}%` }} 
            />
          </div>
          <span className="text-gray-400">{formatWeight(currentWeight)}/{formatWeight(MAX_CAPACITY)}</span>
        </div>
      </div>
      
      {totalItems > 0 ? (
        <div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {Object.entries(player.inventory).map(([drug, quantity]) => {
              const drugName = drug as Drug;
              if (quantity <= 0) return null;
              
              const drugValue = drugMarket[drugName]?.price * quantity || 0;
              const weight = DRUG_WEIGHTS[drugName] * quantity;
              const riskFactor = DRUG_RISK[drugName];
              
              return (
                <div key={drug} 
                  className="border border-zinc-700 rounded p-2 flex justify-between items-center hover:border-zinc-500 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{drug}</span>
                      <span className={`text-xs px-1 rounded-sm ${
                        riskFactor >= 8 ? 'bg-red-900 text-red-200' : 
                        riskFactor >= 5 ? 'bg-yellow-900 text-yellow-200' : 
                        'bg-green-900 text-green-200'
                      }`}>
                        {riskFactor >= 8 ? 'H' : riskFactor >= 5 ? 'M' : 'L'}
                      </span>
                    </div>
                    <div className="flex text-xs mt-1 gap-2">
                      <div className="text-xs text-gray-400">Quantity</div>
                      <div className="text-blue-400 font-medium">{quantity}</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">Value</div>
                      <div className="text-green-400">${drugValue.toLocaleString()}</div>
                    </div>
                    <div className="text-xs text-right mt-1 text-gray-400">
                      {formatWeight(weight)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="border-t border-zinc-700 mt-4 pt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">Total items:</span>
              <span className="font-medium">{totalItems}</span>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">Total value:</span>
              <span className="text-green-400 font-medium">${totalValue.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-400">Weight:</span>
              <span className="font-medium">
                {formatWeight(currentWeight)}
                {capacityPercentage >= 100 && (
                  <span className="text-red-400 ml-2 text-xs animate-pulse">OVERWEIGHT</span>
                )}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Risk level:</span>
              <span className={`font-medium ${riskLevel.color}`}>{riskLevel.level}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-40">
          <div className="text-gray-400 mb-2">Your stash is empty</div>
          <div className="text-xs text-center text-gray-500 max-w-xs">
            Visit the market to purchase product. Transport carefully to avoid detection.
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPanel; 