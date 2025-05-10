import type { Drug } from '../types/game';

export const DRUGS: Record<Drug, { min: number; max: number }> = {
  'Cocaine': { min: 15000, max: 30000 },
  'Heroin': { min: 5000, max: 14000 },
  'Acid': { min: 1000, max: 4500 },
  'Weed': { min: 300, max: 900 },
  'Speed': { min: 100, max: 250 },
  'Ludes': { min: 10, max: 60 }
}; 