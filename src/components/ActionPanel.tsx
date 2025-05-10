import React, { useState } from 'react';
import { useGameStore } from '../state/gameStore';

// Calculate 10% weekly interest rate as daily rate
const DAILY_INTEREST_RATE = 0.1 / 7; // 10% weekly interest converted to daily

const ActionPanel: React.FC = () => {
  const { player, nextDay, depositCash, withdrawCash, payDebt } = useGameStore();
  const [activeTab, setActiveTab] = useState<'bank' | 'loan' | 'day'>('bank');
  const [amount, setAmount] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values
    if (/^\d*$/.test(value)) {
      setAmount(value);
    }
  };
  
  const handleDeposit = () => {
    if (amount && parseInt(amount) > 0) {
      depositCash(parseInt(amount));
      setAmount('');
    }
  };
  
  const handleWithdraw = () => {
    if (amount && parseInt(amount) > 0) {
      withdrawCash(parseInt(amount));
      setAmount('');
    }
  };
  
  const handlePayDebt = () => {
    if (amount && parseInt(amount) > 0) {
      payDebt(parseInt(amount));
      setAmount('');
    }
  };
  
  const handleNextDay = () => {
    if (showConfirmation) {
      nextDay();
      setShowConfirmation(false);
    } else {
      setShowConfirmation(true);
    }
  };
  
  // Calculate daily interest amount
  const dailyInterest = Math.round(player.debt * DAILY_INTEREST_RATE);
  
  // Calculate how many days until debt doubles
  const daysUntilDoubleDebt = Math.ceil(Math.log(2) / Math.log(1 + DAILY_INTEREST_RATE));
  
  // Calculate net worth
  const netWorth = player.cash + player.bank - player.debt;
  
  return (
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title text-shadow-glow">OPERATIONS</h2>
        <div className="text-xs text-blue-400">Day {30 - player.daysLeft + 1} of 30</div>
      </div>
      
      <div className="mb-4">
        <div className="flex border-b border-zinc-700">
          <button
            onClick={() => setActiveTab('bank')}
            className={`px-4 py-2 text-sm border-b-2 transition-colors ${
              activeTab === 'bank' 
                ? 'border-blue-400 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-gray-100'
            }`}
          >
            BANKING
          </button>
          
          <button
            onClick={() => setActiveTab('loan')}
            className={`px-4 py-2 text-sm border-b-2 transition-colors ${
              activeTab === 'loan' 
                ? 'border-blue-400 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-gray-100'
            }`}
          >
            LOANS
          </button>
          
          <button
            onClick={() => setActiveTab('day')}
            className={`px-4 py-2 text-sm border-b-2 transition-colors ${
              activeTab === 'day' 
                ? 'border-blue-400 text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-gray-100'
            }`}
          >
            ADVANCE
          </button>
        </div>
        
        {activeTab === 'bank' && (
          <div className="p-3 border border-zinc-700 rounded-md bg-zinc-900 mt-4">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-400">Cash available:</div>
              <div className="text-lg font-medium text-green-400">
                ${player.cash.toLocaleString()}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-400">Bank balance:</div>
              <div className="text-lg font-medium text-blue-400">
                ${player.bank.toLocaleString()}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-400">Net worth:</div>
              <div className={`text-lg font-medium ${netWorth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                ${netWorth.toLocaleString()}
              </div>
            </div>
            
            <div className="mb-3">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-blue-400 rounded text-center font-mono"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handleDeposit}
                disabled={!amount || parseInt(amount) <= 0 || parseInt(amount) > player.cash}
                className="btn-green flex-1 py-2 transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                DEPOSIT
              </button>
              
              <button
                onClick={handleWithdraw}
                disabled={!amount || parseInt(amount) <= 0 || parseInt(amount) > player.bank}
                className="btn-blue flex-1 py-2 transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                WITHDRAW
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-400">
              <p>• Bank transfers are instant with no fees</p>
              <p>• Funds in bank are safe from theft and police</p>
            </div>
          </div>
        )}
        
        {activeTab === 'loan' && (
          <div className="p-3 border border-zinc-700 rounded-md bg-zinc-900 mt-4">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-400">Current debt:</div>
              <div className="text-lg font-medium text-red-400">
                ${player.debt.toLocaleString()}
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-400">Daily interest:</div>
              <div className="text-md font-medium text-red-400">
                ${dailyInterest.toLocaleString()}
                <span className="text-xs ml-1 text-gray-400">(~{(DAILY_INTEREST_RATE * 100).toFixed(1)}% daily)</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <div className="text-gray-400">Days until doubled:</div>
              <div className="text-md font-medium text-yellow-400">
                {daysUntilDoubleDebt} days
              </div>
            </div>
            
            <div className="mb-3">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 focus:border-blue-400 rounded text-center font-mono"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={handlePayDebt}
                disabled={!amount || parseInt(amount) <= 0 || parseInt(amount) > player.cash || player.debt <= 0}
                className="btn-red flex-1 py-2 transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                PAY DEBT
              </button>
              
              <button
                onClick={() => setAmount(Math.min(player.cash, player.debt).toString())}
                disabled={player.cash <= 0 || player.debt <= 0}
                className="btn flex-1 py-2 transition-all hover:translate-y-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                MAX PAYMENT
              </button>
            </div>
            
            <div className="mt-2 text-xs text-gray-400">
              <p>• Loan carries 10% weekly interest (~{(DAILY_INTEREST_RATE * 100).toFixed(1)}% daily)</p>
              <p>• Pay off debt to avoid spiraling interest costs</p>
            </div>
          </div>
        )}
        
        {activeTab === 'day' && (
          <div className="p-3 border border-zinc-700 rounded-md bg-zinc-900 mt-4">
            <div className="text-center mb-4">
              <div className="text-xl font-bold">DAY {30 - player.daysLeft + 1}</div>
              <div className="text-sm text-gray-400">
                {player.daysLeft} days remaining in your run
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Cash:</span>
                <span className="text-green-400">${player.cash.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Bank:</span>
                <span className="text-blue-400">${player.bank.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Debt:</span>
                <span className="text-red-400">${player.debt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-4 border-t border-zinc-700 pt-2 mt-2">
                <span className="text-gray-400">Interest today:</span>
                <span className="text-red-400">+${dailyInterest.toLocaleString()}</span>
              </div>
            </div>
            
            <button
              onClick={handleNextDay}
              className="btn w-full py-3 hover:bg-blue-400 hover:bg-opacity-20 transition-all hover:translate-y-[-2px] active:translate-y-0"
            >
              NEXT DAY <span className="ml-2 text-gray-400">({player.daysLeft} remaining)</span>
            </button>
            
            {showConfirmation && (
              <div className="mt-3 text-center text-yellow-400 text-sm animate-pulse">
                Click again to confirm and advance to the next day
              </div>
            )}
            
            <p className="text-xs text-gray-400 mt-2 text-center">
              Advancing will update market prices and add interest to debt
            </p>
          </div>
        )}
      </div>
      
      <div className="border-t border-zinc-700 pt-4">
        <div className="text-center text-xs text-gray-400">
          <p>Game progress: {Math.floor(((30 - player.daysLeft) / 30) * 100)}%</p>
          <div className="w-full h-1 bg-zinc-800 rounded-full mt-1 overflow-hidden">
            <div 
              className="h-full bg-blue-400" 
              style={{ width: `${((30 - player.daysLeft) / 30) * 100}%` }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel; 