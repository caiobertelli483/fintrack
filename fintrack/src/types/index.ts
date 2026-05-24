export type TransactionType = "income" | "expense";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  type: TransactionType;
  date: string;
  categoryId: string;
}

export interface DashboardStats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  expensesByCategory: { name: string; value: number; color: string }[];
  recentTransactions: Transaction[];
  insight: string;
}
