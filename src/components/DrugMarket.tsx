import React, { useState } from 'react';
import { useGameStore } from '../state/gameStore';
import type { Drug } from '../types/game';

// Sparkline component to visualize price trends
const SparkLine: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
  const getPath = () => {
    switch (trend) {
      case 'up':
        return "M0 8 L3 5 L6 6 L9 3 L12 2 L15 0";
      case 'down':
        return "M0 0 L3 2 L6 3 L9 5 L12 7 L15 8";
      default:
        return "M0 4 L3 5 L6 3 L9 4 L12 3 L15 4";
    }
  };
  
  const getColor = () => {
    switch (trend) {
      case 'up': return "text-green-400";
      case 'down': return "text-red-400";
      default: return "text-yellow-400";
    }
  };
  
  return (
    <svg className={`w-16 h-8 ${getColor()}`} viewBox="0 0 16 8">
      <path d={getPath()} fill="none" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
};

const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
  const getIndicator = () => {
    switch (trend) {
      case 'up':
        return <span className="text-green-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="ml-1">RISING</span>
        </span>;
      case 'down':
        return <span className="text-red-400 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 112 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="ml-1">FALLING</span>
        </span>;
      default:
        return <span className="text-yellow-400 flex items-center">
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
  
  let textColor = 'text-yellow-400';
  if (margin <= -15) textColor = 'text-green-400';
  else if (margin >= 15) textColor = 'text-red-400';
  
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
  const [expandedCard, setExpandedCard] = useState<Drug | null>(null);
  
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
  
  const toggleExpandCard = (drug: Drug) => {
    if (expandedCard === drug) {
      setExpandedCard(null);
    } else {
      setExpandedCard(drug);
      setSelectedDrug(drug);
    }
  };
  
  // Calculate profit if buying at current price and selling at average
  const getPotentialProfit = (drug: Drug): number => {
    const avgPrice = getAveragePrice(drug);
    const currentPrice = drugMarket[drug].price;
    return ((avgPrice - currentPrice) / currentPrice) * 100;
  };
  
  // Check if drugMarket is initialized
  if (!drugMarket || Object.keys(drugMarket).length === 0) {
    return (
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">MARKET DATA</h2>
        </div>
        <div className="flex items-center justify-center h-40">
          <div className="text-blue-400 animate-pulse">Loading market data...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title text-shadow-glow">MARKET DATA</h2>
        <div className="text-xs text-blue-400">{new Date().toLocaleString()}</div>
      </div>
      
      <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {Object.entries(drugMarket).map(([drug, data]) => {
          const drugName = drug as Drug;
          const avgPrice = getAveragePrice(drugName);
          const potentialProfit = getPotentialProfit(drugName);
          const isExpanded = expandedCard === drugName;
          
          return (
            <div 
              key={drug} 
              className={`data-card p-3 cursor-pointer transition-all border hover:border-blue-400 ${
                selectedDrug === drug ? 'border-blue-400 shadow-md' : 'border-zinc-700'
              } ${isExpanded ? 'col-span-2 md:col-span-3 row-span-2' : ''}`}
              onClick={() => toggleExpandCard(drugName)}
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-semibold">
                  {drug}
                  {isExpanded && <span className="ml-2 text-xs text-gray-400">(Click to collapse)</span>}
                </span>
                <TrendIndicator trend={data.trend} />
              </div>
              
              <div className="text-lg font-bold text-blue-400 mt-2 flex items-center justify-between">
                <span>${data.price.toLocaleString()}</span>
                <ProfitIndicator currentPrice={data.price} averagePrice={avgPrice} />
              </div>
              
              <div className="flex justify-between text-xs mt-2">
                <span className="text-gray-400">Owned: {player.inventory[drugName]}</span>
                {maxAffordable(drugName) > 0 && (
                  <span className="text-green-400">
                    Max: {maxAffordable(drugName)}
                  </span>
                )}
              </div>
              
              {isExpanded && (
                <div className="mt-4 border-t border-zinc-700 pt-2">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[150px]">
                      <h4 className="text-xs uppercase text-gray-400 mb-1">Market Analysis</h4>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs">
                          <div>Range: ${data.min.toLocaleString()} - ${data.max.toLocaleString()}</div>
                          <div>Average: ${avgPrice.toLocaleString()}</div>
                          <div className={potentialProfit > 0 ? "text-green-400" : potentialProfit < 0 ? "text-red-400" : "text-yellow-400"}>
                            Profit potential: {potentialProfit.toFixed(1)}%
                          </div>
                        </div>
                        <SparkLine trend={data.trend} />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-[150px]">
                      <h4 className="text-xs uppercase text-gray-400 mb-1">Trading</h4>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-20 px-2 py-1 bg-zinc-800 border border-zinc-700 focus:border-blue-400 rounded text-center font-mono"
                          placeholder="QTY"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuantity(maxAffordable(drugName).toString());
                            }}
                            className="px-1 py-0.5 text-xs border border-blue-400 text-blue-400 rounded hover:bg-blue-400 hover:bg-opacity-10"
                          >
                            MAX
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQuantity("0");
                            }}
                            className="px-1 py-0.5 text-xs border border-red-400 text-red-400 rounded hover:bg-red-400 hover:bg-opacity-10"
                          >
                            CLR
                          </button>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (quantity) handleBuy();
                          }}
                          disabled={!quantity || parseInt(quantity) <= 0 || player.cash < drugMarket[drugName].price * (parseInt(quantity) || 0)}
                          className="btn-green flex-1 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          BUY
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (quantity) handleSell();
                          }}
                          disabled={!quantity || parseInt(quantity) <= 0 || player.inventory[drugName] < (parseInt(quantity) || 0)}
                          className="btn-red flex-1 py-1 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          SELL
                        </button>
                      </div>
                      {quantity && (
                        <div className="text-xs mt-1 text-center">
                          ${(drugMarket[drugName].price * (parseInt(quantity) || 0)).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {selectedDrug && drugMarket[selectedDrug] && !expandedCard && (
        <div className="border-t border-zinc-700 pt-4 mt-4">
          <div className="mb-2 flex justify-between">
            <div className="text-sm">{selectedDrug} - ${drugMarket[selectedDrug].price.toLocaleString()}/unit</div>
            <div className="text-gray-400 text-sm">Owned: {player.inventory[selectedDrug]}</div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center gap-2">
              <label className="text-gray-400 text-sm">QUANTITY:</label>
              <input
                type="text"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-28 px-3 py-1.5 bg-zinc-800 border border-zinc-700 focus:border-blue-400 rounded text-center font-mono"
                placeholder="###"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleBuy}
                disabled={!quantity || parseInt(quantity) <= 0 || player.cash < drugMarket[selectedDrug].price * (parseInt(quantity) || 0)}
                className="btn-green flex-1 transition-transform active:scale-95"
              >
                BUY (${quantity ? (drugMarket[selectedDrug].price * (parseInt(quantity) || 0)).toLocaleString() : '0'})
              </button>
              
              <button
                onClick={handleSell}
                disabled={!quantity || parseInt(quantity) <= 0 || player.inventory[selectedDrug] < (parseInt(quantity) || 0)}
                className="btn-red flex-1 transition-transform active:scale-95"
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