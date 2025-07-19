const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  category_name?: string;
  category_color?: string;
  category_icon?: string;
  category_id?: number;
}

export interface Balance {
  current_balance: number;
  monthly_change: number;
  total_income: number;
  total_expenses: number;
}

export interface Statistics {
  date: string;
  income: number;
  expenses: number;
}

// API functions
export const api = {
  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/api/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  async createCategory(category: Omit<Category, 'id' | 'created_at' | 'updated_at'>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  async updateCategory(id: number, category: Partial<Category>): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(category),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  async deleteCategory(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/categories/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
  },

  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_BASE_URL}/api/transactions`);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/api/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to create transaction');
    return response.json();
  },

  async updateTransaction(id: number, transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transaction),
    });
    if (!response.ok) throw new Error('Failed to update transaction');
    return response.json();
  },

  async deleteTransaction(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/transactions/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete transaction');
  },

  // Balance
  async getBalance(): Promise<Balance> {
    const response = await fetch(`${API_BASE_URL}/api/balance`);
    if (!response.ok) throw new Error('Failed to fetch balance');
    return response.json();
  },

  // Statistics
  async getStatistics(period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<Statistics[]> {
    const response = await fetch(`${API_BASE_URL}/api/statistics?period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch statistics');
    return response.json();
  },
}; 