import React, { useEffect, useState } from 'react';
import { useGameStore } from '../state/gameStore';
import PlayerStats from '../components/PlayerStats';
import DrugMarket from '../components/DrugMarket';
import CitySelector from '../components/CitySelector';
import ActionPanel from '../components/ActionPanel';

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
      <div className="h-screen flex items-center justify-center">
        <div className="card max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">Game Over</h1>
          <p className="mb-4">You've completed your 30 days in the drug trade.</p>
          
          <div className="mb-6">
            <h2 className="text-xl mb-2">Final Stats</h2>
            <p className="text-green-400">Cash: ${player.cash.toLocaleString()}</p>
            <p className="text-blue-400">Bank: ${player.bank.toLocaleString()}</p>
            <p className="text-red-400">Debt: ${player.debt.toLocaleString()}</p>
            <p className="mt-2 text-xl">
              Total Worth: ${(player.cash + player.bank - player.debt).toLocaleString()}
            </p>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="btn w-full bg-blue-600 hover:bg-blue-700"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }
  
  if (!isStarted) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="card max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6 text-center">Drug Wars</h1>
          
          <div className="mb-4">
            <label className="block text-gray-400 mb-1">Enter your name:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded"
              placeholder="Your Name"
            />
          </div>
          
          <button
            onClick={() => setIsStarted(true)}
            className="btn w-full bg-blue-600 hover:bg-blue-700"
          >
            Start Game
          </button>
          
          <div className="mt-6 text-gray-400 text-sm">
            <p>Welcome to Drug Wars! You have 30 days to make as much money as possible.</p>
            <p className="mt-2">Buy low, sell high, and watch out for the cops!</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Drug Wars</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <PlayerStats />
          <div className="mt-6">
            <ActionPanel />
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <DrugMarket />
          <div className="mt-6">
            <CitySelector />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameView; 