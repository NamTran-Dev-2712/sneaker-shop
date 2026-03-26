export interface FinanceTrendPoint {
  date: string;
  income: number;
  expense: number;
  profit: number;
}

export type GetFinanceTrendResponse = FinanceTrendPoint[];
