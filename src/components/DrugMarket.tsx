import React, { useState } from 'react';
import { useGameStore } from '../state/gameStore';
import type { Drug } from '../types/game';

const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
  const getIndicator = () => {
    switch (trend) {
      case 'up':
        return <span className="text-accent-green flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="ml-1">RISING</span>
        </span>;
      case 'down':
        return <span className="text-accent-red flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 112 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="ml-1">FALLING</span>
        </span>;
      default:
        return <span className="text-accent-amber flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <span className="ml-1">STABLE</span>
        </span>;
    }
  };
  
  return getIndicator();
};

// Calculate profit margin as a percentage
const ProfitIndicator: React.FC<{ currentPrice: number; averagePrice: number }> = ({ currentPrice, averagePrice }) => {
  const margin = ((currentPrice - averagePrice) / averagePrice) * 100;
  
  let textColor = 'text-accent-amber';
  if (margin <= -15) textColor = 'text-accent-green';
  else if (margin >= 15) textColor = 'text-accent-red';
  
  return (
    <span className={`text-xs ${textColor}`}>
      {margin >= 0 ? `+${margin.toFixed(1)}%` : `${margin.toFixed(1)}%`}
    </span>
  );
};

const DrugMarket: React.FC = () => {
  const { drugMarket, buyDrug, sellDrug, player } = useGameStore();
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [quantity, setQuantity] = useState<string>('');
  
  const handleBuy = () => {
    if (selectedDrug && quantity) {
      buyDrug(selectedDrug, parseInt(quantity) || 1);
      setQuantity('');
    }
  };
  
  const handleSell = () => {
    if (selectedDrug && quantity) {
      sellDrug(selectedDrug, parseInt(quantity) || 1);
      setQuantity('');
    }
  };
  
  const maxAffordable = (drug: Drug): number => {
    return Math.floor(player.cash / drugMarket[drug]?.price || 1);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values
    if (/^\d*$/.test(value)) {
      setQuantity(value);
    }
  };
  
  // Calculate average price for each drug
  const getAveragePrice = (drug: Drug): number => {
    return (drugMarket[drug].min + drugMarket[drug].max) / 2;
  };
  
  // Check if drugMarket is initialized
  if (!drugMarket || Object.keys(drugMarket).length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">MARKET DATA</h2>
        </div>
        <div className="flex items-center justify-center h-40">
          <div className="text-accent-blue animate-pulse">Loading market data...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">MARKET DATA</h2>
        <div className="text-xs text-accent-blue">{new Date().toLocaleString()}</div>
      </div>
      
      <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(drugMarket).map(([drug, data]) => {
          const drugName = drug as Drug;
          const avgPrice = getAveragePrice(drugName);
          
          return (
            <div 
              key={drug} 
              className={`data-card p-3 cursor-pointer transition-all border hover:border-accent-blue ${
                selectedDrug === drug ? 'border-accent-blue shadow-neon-blue' : 'border-border-DEFAULT'
              }`}
              onClick={() => setSelectedDrug(drugName)}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold">{drug}</span>
                <TrendIndicator trend={data.trend} />
              </div>
              
              <div className="text-lg font-bold text-accent-blue mt-2">
                ${data.price.toLocaleString()}
                <ProfitIndicator currentPrice={data.price} averagePrice={avgPrice} />
              </div>
              
              <div className="flex justify-between text-xs mt-2">
                <span className="text-text-secondary">Owned: {player.inventory[drugName]}</span>
                {maxAffordable(drugName) > 0 && (
                  <span className="text-accent-green">
                    Max: {maxAffordable(drugName)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedDrug && drugMarket[selectedDrug] && (
        <div className="border-t border-border-DEFAULT pt-4 mt-4">
          <div className="mb-2 flex justify-between">
            <div className="text-sm">{selectedDrug} - ${drugMarket[selectedDrug].price.toLocaleString()}/unit</div>
            <div className="text-text-secondary text-sm">Owned: {player.inventory[selectedDrug]}</div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label className="text-text-secondary text-sm">QUANTITY:</label>
              <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-28 px-3 py-1.5 bg-background-light border border-border-DEFAULT focus:border-accent-blue rounded text-center font-mono"
                placeholder="###"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleBuy}
                disabled={!quantity || parseInt(quantity) <= 0 || player.cash < drugMarket[selectedDrug].price * (parseInt(quantity) || 0)}
                className="btn btn-green flex-1"
              >
                BUY (${quantity ? (drugMarket[selectedDrug].price * (parseInt(quantity) || 0)).toLocaleString() : '0'})
              </button>
              
              <button
                onClick={handleSell}
                disabled={!quantity || parseInt(quantity) <= 0 || player.inventory[selectedDrug] < (parseInt(quantity) || 0)}
                className="btn btn-red flex-1"
              >
                SELL (${quantity ? (drugMarket[selectedDrug].price * (parseInt(quantity) || 0)).toLocaleString() : '0'})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugMarket; 