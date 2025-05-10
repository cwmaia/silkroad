import React from 'react';
import { useGameStore } from '../state/gameStore';
import type { Drug } from '../types/game';

// Glowing text effect based on value changes
const AnimatedValue: React.FC<{ value: number; prefix?: string; className?: string }> = ({ 
  value, 
  prefix = '', 
  className = ''
}) => {
  const formattedValue = value.toLocaleString();
  
  return (
    <span className={`transition-all ${className}`}>
      {prefix}{formattedValue}
    </span>
  );
};

const HUD: React.FC = () => {
  const { player, drugMarket } = useGameStore();
  
  // Calculate total inventory value
  const calculateInventoryValue = (): number => {
    if (!drugMarket || Object.keys(drugMarket).length === 0) {
      return 0;
    }
    
    return Object.entries(player.inventory).reduce((acc, [drug, count]) => {
      // @ts-ignore
      const drugPrice = drugMarket[drug]?.price || 0;
      return acc + (drugPrice * count);
    }, 0);
  };
  
  // Calculate net worth
  const netWorth = player.cash + player.bank - player.debt;
  const inventoryValue = calculateInventoryValue();
  
  // Get status indicators
  const getStatusIndicator = () => {
    if (player.debt === 0) return { text: "DEBT FREE", color: "text-green-400" };
    if (player.debt > 10000) return { text: "HIGH DEBT", color: "text-red-400" };
    return { text: "ACTIVE", color: "text-blue-400" };
  };
  
  const timeOfDay = ["MORNING", "AFTERNOON", "EVENING", "NIGHT"][Math.floor(Math.random() * 4)];
  const statusIndicator = getStatusIndicator();
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-700 px-4 py-2 z-50 backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-1">
          {/* Left side - Financial stats */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs uppercase tracking-wider">CASH:</span>
              <AnimatedValue 
                value={player.cash} 
                prefix="$" 
                className="text-green-400 font-medium"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs uppercase tracking-wider">BANK:</span>
              <AnimatedValue 
                value={player.bank} 
                prefix="$" 
                className="text-blue-400 font-medium"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs uppercase tracking-wider">DEBT:</span>
              <AnimatedValue 
                value={player.debt} 
                prefix="$" 
                className={`${player.debt > 0 ? 'text-red-400' : 'text-gray-500'} font-medium`}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs uppercase tracking-wider">STASH VALUE:</span>
              <AnimatedValue 
                value={inventoryValue} 
                prefix="$" 
                className="text-yellow-400 font-medium"
              />
            </div>
          </div>
          
          {/* Right side - Status info */}
          <div className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs uppercase tracking-wider">LOCATION:</span>
              <span className="text-white font-medium">{player.location}</span>
              <span className="text-xs text-gray-500">{timeOfDay}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs uppercase tracking-wider">DAYS LEFT:</span>
              <div className="flex items-center">
                <span className="text-white font-medium">{player.daysLeft}</span>
                <div className="ml-1 h-2 w-24 bg-zinc-800 rounded-full">
                  <div 
                    className="h-full bg-blue-400 rounded-full"
                    style={{ width: `${(player.daysLeft / 30) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-xs uppercase tracking-wider">NET WORTH:</span>
              <span className={`font-medium ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${netWorth.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${statusIndicator.color} bg-opacity-20 border ${statusIndicator.color.replace('text', 'border')}`}>
                {statusIndicator.text}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUD; 