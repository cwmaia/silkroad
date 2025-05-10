export type Drug = 'Heroin' | 'Cocaine' | 'Acid' | 'Weed' | 'Speed' | 'Ludes';

export type Player = {
  name: string;
  cash: number;
  bank: number;
  debt: number;
  location: string;
  inventory: Record<Drug, number>;
  daysLeft: number;
};

export type DrugMarket = Record<Drug, {
  price: number;
  min: number;
  max: number;
  trend: 'up' | 'down' | 'stable';
}>;

export type City = {
  name: string;
  risk: number;
  modifiers?: Partial<Record<Drug, number>>;
}; 