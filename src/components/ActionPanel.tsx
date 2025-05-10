import React, { useState } from 'react';
import { useGameStore } from '../state/gameStore';

const ActionPanel: React.FC = () => {
  const { nextDay, depositCash, withdrawCash, payDebt, player } = useGameStore();
  const [bankAmount, setBankAmount] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'debt'>('deposit');
  
  const handleNextDay = () => {
    nextDay();
  };
  
  const handleDeposit = () => {
    const amount = parseInt(bankAmount) || 0;
    if (amount > 0 && amount <= player.cash) {
      depositCash(amount);
      setBankAmount('');
    }
  };
  
  const handleWithdraw = () => {
    const amount = parseInt(bankAmount) || 0;
    if (amount > 0 && amount <= player.bank) {
      withdrawCash(amount);
      setBankAmount('');
    }
  };
  
  const handlePayDebt = () => {
    const amount = parseInt(bankAmount) || 0;
    if (amount > 0 && amount <= player.cash) {
      payDebt(amount);
      setBankAmount('');
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numeric values
    if (/^\d*$/.test(value)) {
      setBankAmount(value);
    }
  };

  const getMaxAmount = () => {
    switch (activeTab) {
      case 'deposit':
        return player.cash;
      case 'withdraw':
        return player.bank;
      case 'debt':
        return Math.min(player.cash, player.debt);
      default:
        return 0;
    }
  };

  const isButtonDisabled = () => {
    const amount = parseInt(bankAmount) || 0;
    switch (activeTab) {
      case 'deposit':
        return !bankAmount || amount <= 0 || amount > player.cash;
      case 'withdraw':
        return !bankAmount || amount <= 0 || amount > player.bank;
      case 'debt':
        return !bankAmount || amount <= 0 || amount > player.cash || player.debt === 0;
      default:
        return true;
    }
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Actions</h2>
      
      <div className="flex flex-col space-y-4">
        <div>
          <h3 className="text-lg mb-3">Bank Operations</h3>
          
          {/* Tab Navigation */}
          <div className="flex mb-3 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`px-3 py-1 font-medium ${activeTab === 'deposit' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400'}`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-3 py-1 font-medium ${activeTab === 'withdraw' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            >
              Withdraw
            </button>
            <button
              onClick={() => setActiveTab('debt')}
              className={`px-3 py-1 font-medium ${activeTab === 'debt' ? 'text-red-400 border-b-2 border-red-400' : 'text-gray-400'}`}
              disabled={player.debt === 0}
            >
              Pay Debt
            </button>
          </div>
          
          {/* Account Info */}
          <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
            <div>
              <p className="text-gray-400">Cash</p>
              <p className="text-green-400">${player.cash.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Bank</p>
              <p className="text-blue-400">${player.bank.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400">Debt</p>
              <p className="text-red-400">${player.debt.toLocaleString()}</p>
            </div>
          </div>
          
          {/* Action UI */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={bankAmount}
              onChange={handleAmountChange}
              className="w-40 px-2 py-1 bg-gray-700 rounded text-center"
              placeholder="$$$"
            />
            
            <button 
              className={`btn flex-grow ${
                activeTab === 'deposit' ? 'bg-green-600 hover:bg-green-700' :
                activeTab === 'withdraw' ? 'bg-blue-600 hover:bg-blue-700' :
                'bg-red-600 hover:bg-red-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={
                activeTab === 'deposit' ? handleDeposit :
                activeTab === 'withdraw' ? handleWithdraw :
                handlePayDebt
              }
              disabled={isButtonDisabled()}
            >
              {activeTab === 'deposit' ? 'Deposit' :
               activeTab === 'withdraw' ? 'Withdraw' :
               'Pay Debt'}
            </button>
          </div>
          
          <div className="flex justify-between text-xs text-gray-400 mb-2">
            <span>Available: ${getMaxAmount().toLocaleString()}</span>
            {bankAmount && <span>Amount: ${parseInt(bankAmount).toLocaleString() || '0'}</span>}
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