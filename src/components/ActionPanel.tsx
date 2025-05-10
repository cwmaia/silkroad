import React, { useState } from 'react';
import { useGameStore } from '../state/gameStore';

const ActionPanel: React.FC = () => {
  const { nextDay, depositCash, withdrawCash, payDebt, player } = useGameStore();
  const [bankAmount, setBankAmount] = useState(0);
  
  const handleNextDay = () => {
    nextDay();
  };
  
  const handleDeposit = () => {
    if (bankAmount > 0 && bankAmount <= player.cash) {
      depositCash(bankAmount);
      setBankAmount(0);
    }
  };
  
  const handleWithdraw = () => {
    if (bankAmount > 0 && bankAmount <= player.bank) {
      withdrawCash(bankAmount);
      setBankAmount(0);
    }
  };
  
  const handlePayDebt = () => {
    if (bankAmount > 0 && bankAmount <= player.cash) {
      payDebt(bankAmount);
      setBankAmount(0);
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values
    if (/^\d*$/.test(value)) {
      const num = parseInt(value) || 0;
      setBankAmount(num);
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Actions</h2>
      
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-lg mb-2">Bank Operations</h3>
          <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
            <input
              type="text"
              value={bankAmount}
              onChange={handleAmountChange}
              className="w-40 px-2 py-1 bg-gray-700 rounded text-center"
              placeholder="Amount"
            />
            
            <div className="flex gap-2">
              <button
                onClick={handleDeposit}
                disabled={bankAmount <= 0 || bankAmount > player.cash}
                className="btn bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deposit
              </button>
              
              <button
                onClick={handleWithdraw}
                disabled={bankAmount <= 0 || bankAmount > player.bank}
                className="btn bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw
              </button>
              
              <button
                onClick={handlePayDebt}
                disabled={bankAmount <= 0 || bankAmount > player.cash || player.debt === 0}
                className="btn bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay Debt
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-400">
            The bank pays no interest, but your debt grows by 10% each week!
          </p>
        </div>
        
        <div className="border-t border-gray-700 pt-4">
          <button
            onClick={handleNextDay}
            className="btn bg-purple-600 hover:bg-purple-700 w-full py-3"
          >
            Skip to Next Day ({player.daysLeft} left)
          </button>
          <p className="text-sm text-gray-400 mt-2">
            Moving to the next day will update all drug prices.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel; 