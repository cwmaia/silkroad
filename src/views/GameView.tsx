import React, { useEffect, useState } from 'react';
import { useGameStore } from '../state/gameStore';
import PlayerStats from '../components/PlayerStats';
import DrugMarket from '../components/DrugMarket';
import CitySelector from '../components/CitySelector';
import ActionPanel from '../components/ActionPanel';
import InventoryPanel from '../components/InventoryPanel';
import Sidebar from '../components/Sidebar';
import EventFeed from '../components/EventFeed';
import HUD from '../components/HUD';

const GameView: React.FC = () => {
  const { startGame, gameOver, player } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  
  useEffect(() => {
    // Initialize market on component mount
    if (isStarted) {
      startGame(playerName || 'Anonymous');
    }
  }, [isStarted, playerName, startGame]);
  
  if (gameOver) {
    return (
      <div className="h-screen flex items-center justify-center p-4">
        <div className="panel max-w-md w-full text-center">
          <div className="panel-header">
            <h1 className="panel-title text-accent-red">MISSION COMPLETED</h1>
          </div>
          
          <p className="mb-6">You've completed your 30 days in the underground market.</p>
          
          <div className="mb-6 space-y-2">
            <h2 className="text-lg uppercase tracking-wider">Final Stats</h2>
            
            <div className="data-card">
              <div className="data-card-header">Cash</div>
              <div className="data-card-value text-accent-green">${player.cash.toLocaleString()}</div>
            </div>
            
            <div className="data-card">
              <div className="data-card-header">Bank</div>
              <div className="data-card-value text-accent-blue">${player.bank.toLocaleString()}</div>
            </div>
            
            <div className="data-card">
              <div className="data-card-header">Debt</div>
              <div className="data-card-value text-accent-red">${player.debt.toLocaleString()}</div>
            </div>
            
            <div className="data-card">
              <div className="data-card-header">Net Worth</div>
              <div className="data-card-value text-accent-blue">${(player.cash + player.bank - player.debt).toLocaleString()}</div>
            </div>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="btn w-full"
          >
            PLAY AGAIN
          </button>
        </div>
      </div>
    );
  }
  
  if (!isStarted) {
    return (
      <div className="h-screen flex items-center justify-center p-4 bg-background-dark">
        <div className="panel max-w-md w-full">
          <div className="panel-header mb-6">
            <h1 className="text-3xl text-center text-accent-blue font-bold terminal-flicker tracking-wider">SILKROAD</h1>
          </div>
          
          <div className="mb-8">
            <div className="text-center mb-6">
              <div className="text-text-secondary mb-2">DARKNET COMMERCE TERMINAL v1.0.3</div>
              <div className="text-text-primary text-sm">UNAUTHORIZED ACCESS IS PROHIBITED</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-text-secondary text-xs uppercase mb-2">OPERATIVE CODENAME:</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="w-full px-3 py-2 bg-background-light border border-border-DEFAULT focus:border-accent-blue rounded font-mono"
                placeholder="ENTER NAME"
              />
            </div>
            
            <button
              onClick={() => setIsStarted(true)}
              className="btn w-full py-3"
            >
              INITIALIZE SESSION
            </button>
          </div>
          
          <div className="border-t border-border-DEFAULT pt-4 text-text-secondary text-sm">
            <p className="mb-2"><span className="text-accent-blue">{`>`}</span> Welcome to SilkRoad. You have 30 days to maximize profits.</p>
            <p className="mb-2"><span className="text-accent-blue">{`>`}</span> Current debt: $5,500 at 10% weekly interest.</p>
            <p><span className="text-accent-blue">{`>`}</span> Buy low, sell high. Avoid authorities.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background-dark pb-16">
      {/* Main Layout */}
      <div className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Sidebar - Navigation and Player Info */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DrugMarket />
              <InventoryPanel />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ActionPanel />
              <EventFeed />
            </div>
          </div>
        </div>
      </div>
      
      {/* Fixed HUD at bottom */}
      <HUD />
    </div>
  );
};

export default GameView; 