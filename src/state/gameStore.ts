import { create } from 'zustand';
import type { Player, Drug, DrugMarket, City } from '../types/game';
import { CITIES } from '../data/cities';
import { generateMarket } from '../utils/priceGenerator';

interface GameState {
  player: Player;
  cities: City[];
  currentCity: City;
  drugMarket: DrugMarket;
  gameOver: boolean;
  
  // Actions
  startGame: (playerName: string) => void;
  nextDay: () => void;
  buyDrug: (drug: Drug, quantity: number) => void;
  sellDrug: (drug: Drug, quantity: number) => void;
  travel: (cityName: string) => void;
  depositCash: (amount: number) => void;
  withdrawCash: (amount: number) => void;
  payDebt: (amount: number) => void;
}

const MAX_DAYS = 30;

export const useGameStore = create<GameState>((set, get) => ({
  player: {
    name: '',
    cash: 2000,
    bank: 0,
    debt: 5500,
    location: CITIES[0].name,
    inventory: {
      'Heroin': 0,
      'Cocaine': 0,
      'Acid': 0,
      'Weed': 0,
      'Speed': 0,
      'Ludes': 0
    },
    daysLeft: MAX_DAYS
  },
  
  cities: CITIES,
  currentCity: CITIES[0],
  drugMarket: {} as DrugMarket,
  gameOver: false,
  
  startGame: (playerName: string) => set(state => {
    const firstCity = CITIES[0];
    return {
      player: {
        ...state.player,
        name: playerName,
        location: firstCity.name
      },
      currentCity: firstCity,
      drugMarket: generateMarket(firstCity.modifiers),
      gameOver: false
    };
  }),
  
  nextDay: () => set(state => {
    // Check if game over
    if (state.player.daysLeft <= 1) {
      return { gameOver: true };
    }
    
    // Update market prices
    const newMarket = generateMarket(state.currentCity.modifiers);
    
    // Update player days left
    return {
      player: {
        ...state.player,
        daysLeft: state.player.daysLeft - 1
      },
      drugMarket: newMarket
    };
  }),
  
  buyDrug: (drug: Drug, quantity: number) => set(state => {
    const price = state.drugMarket[drug].price;
    const totalCost = price * quantity;
    
    // Check if player has enough cash
    if (state.player.cash < totalCost) {
      return state; // Can't afford
    }
    
    // Update player inventory and cash
    const newInventory = {
      ...state.player.inventory,
      [drug]: state.player.inventory[drug] + quantity
    };
    
    return {
      player: {
        ...state.player,
        cash: state.player.cash - totalCost,
        inventory: newInventory
      }
    };
  }),
  
  sellDrug: (drug: Drug, quantity: number) => set(state => {
    // Check if player has enough drugs to sell
    if (state.player.inventory[drug] < quantity) {
      return state; // Not enough to sell
    }
    
    const price = state.drugMarket[drug].price;
    const totalProfit = price * quantity;
    
    // Update player inventory and cash
    const newInventory = {
      ...state.player.inventory,
      [drug]: state.player.inventory[drug] - quantity
    };
    
    return {
      player: {
        ...state.player,
        cash: state.player.cash + totalProfit,
        inventory: newInventory
      }
    };
  }),
  
  travel: (cityName: string) => set(state => {
    const newCity = state.cities.find(city => city.name === cityName);
    
    if (!newCity) {
      return state; // City not found
    }
    
    // Update player location and generate new market
    return {
      player: {
        ...state.player,
        location: newCity.name
      },
      currentCity: newCity,
      drugMarket: generateMarket(newCity.modifiers)
    };
  }),
  
  depositCash: (amount: number) => set(state => {
    // Check if player has enough cash
    if (state.player.cash < amount) {
      return state; // Not enough cash
    }
    
    return {
      player: {
        ...state.player,
        cash: state.player.cash - amount,
        bank: state.player.bank + amount
      }
    };
  }),
  
  withdrawCash: (amount: number) => set(state => {
    // Check if player has enough money in bank
    if (state.player.bank < amount) {
      return state; // Not enough in bank
    }
    
    return {
      player: {
        ...state.player,
        cash: state.player.cash + amount,
        bank: state.player.bank - amount
      }
    };
  }),
  
  payDebt: (amount: number) => set(state => {
    // Check if player has enough cash
    if (state.player.cash < amount) {
      return state; // Not enough cash
    }
    
    // Check if amount is greater than debt
    const paymentAmount = Math.min(amount, state.player.debt);
    
    return {
      player: {
        ...state.player,
        cash: state.player.cash - paymentAmount,
        debt: state.player.debt - paymentAmount
      }
    };
  })
})); 