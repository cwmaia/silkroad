import type { City } from '../types/game';

export const CITIES: City[] = [
  {
    name: 'Bronx',
    risk: 0.3,
    modifiers: {
      'Heroin': 0.8, // Cheaper heroin in the Bronx
    }
  },
  {
    name: 'Brooklyn',
    risk: 0.2,
    modifiers: {
      'Weed': 0.9, // Cheaper weed
    }
  },
  {
    name: 'Manhattan',
    risk: 0.4,
    modifiers: {
      'Cocaine': 0.85, // Cheaper cocaine in Manhattan
    }
  },
  {
    name: 'Queens',
    risk: 0.2,
    modifiers: {
      'Ludes': 0.9, // Cheaper ludes
    }
  },
  {
    name: 'Staten Island',
    risk: 0.1,
    modifiers: {
      'Speed': 0.9, // Cheaper speed
    }
  },
  {
    name: 'Central Park',
    risk: 0.5,
    modifiers: {
      'Acid': 0.8, // Cheaper acid in Central Park
    }
  }
]; 