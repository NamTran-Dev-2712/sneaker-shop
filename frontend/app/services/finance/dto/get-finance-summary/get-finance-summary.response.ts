export interface GetFinanceSummaryResponse {
  totalIncome: number;
  totalExpense: number;
  profit: number;
  totalTransactions: number;
  rangeStart: string;
  rangeEnd: string;
}
