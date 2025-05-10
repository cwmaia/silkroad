import React, { useState } from 'react';
import { useGameStore } from '../state/gameStore';
import type { Drug } from '../types/game';

const TrendIndicator: React.FC<{ trend: 'up' | 'down' | 'stable' }> = ({ trend }) => {
  if (trend === 'up') {
    return <span className="text-green-500">↑</span>;
  } else if (trend === 'down') {
    return <span className="text-red-500">↓</span>;
  }
  return <span className="text-gray-500">→</span>;
};

const DrugMarket: React.FC = () => {
  const { drugMarket, buyDrug, sellDrug, player } = useGameStore();
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const handleBuy = () => {
    if (selectedDrug) {
      buyDrug(selectedDrug, quantity);
      setQuantity(1);
    }
  };
  
  const handleSell = () => {
    if (selectedDrug) {
      sellDrug(selectedDrug, quantity);
      setQuantity(1);
    }
  };
  
  const maxAffordable = (drug: Drug): number => {
    return Math.floor(player.cash / drugMarket[drug].price);
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-2">Drug Market</h2>
      
      <div className="mb-4">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2">Drug</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Trend</th>
              <th className="py-2 text-right">Owned</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(drugMarket).map(([drug, data]) => (
              <tr 
                key={drug} 
                className={`border-b border-gray-700 hover:bg-gray-700 cursor-pointer ${
                  selectedDrug === drug ? 'bg-gray-700' : ''
                }`}
                onClick={() => setSelectedDrug(drug as Drug)}
              >
                <td className="py-2">{drug}</td>
                <td className="py-2 text-right">${data.price.toLocaleString()}</td>
                <td className="py-2 text-right">
                  <TrendIndicator trend={data.trend} />
                </td>
                <td className="py-2 text-right">{player.inventory[drug as Drug]}</td>
                <td className="py-2 text-right">
                  {maxAffordable(drug as Drug) > 0 && (
                    <span className="text-xs text-gray-400">
                      (max: {maxAffordable(drug as Drug)})
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {selectedDrug && (
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-400">Quantity:</label>
            <input
              type="number"
              min="1"
              max={Math.max(maxAffordable(selectedDrug), player.inventory[selectedDrug])}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-20 px-2 py-1 bg-gray-700 rounded"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleBuy}
              disabled={player.cash < drugMarket[selectedDrug].price * quantity}
              className="btn bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Buy (${(drugMarket[selectedDrug].price * quantity).toLocaleString()})
            </button>
            
            <button
              onClick={handleSell}
              disabled={player.inventory[selectedDrug] < quantity}
              className="btn bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sell (${(drugMarket[selectedDrug].price * quantity).toLocaleString()})
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugMarket; 