import type { Drug, DrugMarket } from '../types/game';
import { DRUGS } from '../data/drugs';

/**
 * Generate a random number between min and max (inclusive)
 */
export const randomBetween = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Generate a random price for a drug based on its min/max values
 */
export const generateDrugPrice = (drug: Drug, cityModifier?: number): number => {
  const { min, max } = DRUGS[drug];
  const basePrice = randomBetween(min, max);
  
  // Apply city modifier if it exists
  if (cityModifier) {
    return Math.round(basePrice * cityModifier);
  }
  
  return basePrice;
};

/**
 * Generate a market with random prices for all drugs
 */
export const generateMarket = (cityModifiers?: Partial<Record<Drug, number>>): DrugMarket => {
  const market: DrugMarket = {} as DrugMarket;
  
  Object.keys(DRUGS).forEach((drug) => {
    const drugName = drug as Drug;
    const cityModifier = cityModifiers?.[drugName];
    const price = generateDrugPrice(drugName, cityModifier);
    
    market[drugName] = {
      price,
      min: DRUGS[drugName].min,
      max: DRUGS[drugName].max,
      trend: calculateTrend(price, DRUGS[drugName].min, DRUGS[drugName].max)
    };
  });
  
  return market;
};

/**
 * Calculate price trend based on where the price falls in the range
 */
const calculateTrend = (price: number, min: number, max: number): 'up' | 'down' | 'stable' => {
  const range = max - min;
  const thirdOfRange = range / 3;
  
  if (price < min + thirdOfRange) {
    return 'up'; // Price is low, likely to go up
  } else if (price > max - thirdOfRange) {
    return 'down'; // Price is high, likely to go down
  } else {
    return 'stable'; // Price is in the middle range
  }
}; 