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
    <div className="panel">
      <div className="panel-header">
        <h2 className="panel-title">FINANCIAL OPERATIONS</h2>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div>          
          {/* Tab Navigation */}
          <div className="flex mb-4">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`px-4 py-2 text-sm uppercase font-medium border-b-2 transition-colors ${
                activeTab === 'deposit' 
                  ? 'border-accent-green text-accent-green' 
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Deposit
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-4 py-2 text-sm uppercase font-medium border-b-2 transition-colors ${
                activeTab === 'withdraw' 
                  ? 'border-accent-blue text-accent-blue' 
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Withdraw
            </button>
            <button
              onClick={() => setActiveTab('debt')}
              className={`px-4 py-2 text-sm uppercase font-medium border-b-2 transition-colors ${
                activeTab === 'debt' 
                  ? 'border-accent-red text-accent-red' 
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
              disabled={player.debt === 0}
            >
              Pay Debt
            </button>
          </div>
          
          {/* Operation UI based on active tab */}
          <div className="p-3 border border-border-DEFAULT rounded-md bg-background-dark">
            <div className="mb-3">
              {activeTab === 'deposit' && (
                <div className="flex justify-between text-sm">
                  <div className="text-text-secondary">Cash available:</div>
                  <div className="text-accent-green">${player.cash.toLocaleString()}</div>
                </div>
              )}
              
              {activeTab === 'withdraw' && (
                <div className="flex justify-between text-sm">
                  <div className="text-text-secondary">Bank balance:</div>
                  <div className="text-accent-blue">${player.bank.toLocaleString()}</div>
                </div>
              )}
              
              {activeTab === 'debt' && (
                <div className="flex justify-between text-sm">
                  <div className="text-text-secondary">Current debt:</div>
                  <div className="text-accent-red">${player.debt.toLocaleString()}</div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={bankAmount}
                onChange={handleAmountChange}
                className="w-full px-3 py-2 bg-background-light border border-border-DEFAULT focus:border-accent-blue rounded text-center font-mono"
                placeholder="$$$"
              />
              
              <button 
                className={`
                  btn whitespace-nowrap
                  ${activeTab === 'deposit' ? 'btn-green' : activeTab === 'withdraw' ? 'btn' : 'btn-red'}
                `}
                onClick={
                  activeTab === 'deposit' ? handleDeposit :
                  activeTab === 'withdraw' ? handleWithdraw :
                  handlePayDebt
                }
                disabled={isButtonDisabled()}
              >
                {activeTab === 'deposit' ? 'DEPOSIT' :
                 activeTab === 'withdraw' ? 'WITHDRAW' :
                 'PAY DEBT'}
              </button>
            </div>
            
            <div className="mt-2 text-xs text-text-secondary">
              {activeTab === 'deposit' && 'Transfer cash to your bank account for safekeeping.'}
              {activeTab === 'withdraw' && 'Withdraw money from your bank account.'}
              {activeTab === 'debt' && 'Pay off your debt to reduce interest payments.'}
            </div>
          </div>
          
          <div className="text-xs text-accent-amber mt-3">
            Interest accrues at 10% weekly on unpaid debt.
          </div>
        </div>
        
        <div className="border-t border-border-DEFAULT pt-4">
          <button
            onClick={handleNextDay}
            className="btn w-full py-3 hover:shadow-neon-blue"
          >
            NEXT DAY <span className="ml-2 text-text-secondary">({player.daysLeft} remaining)</span>
          </button>
          <p className="text-xs text-text-secondary mt-2 text-center">
            Moving to the next day will update all drug prices and market conditions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel; 