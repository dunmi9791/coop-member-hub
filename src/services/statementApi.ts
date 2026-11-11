import api from '@/hooks/api';

export interface StatementCurrency {
  id: number;
  name: string;
  symbol: string;
}

export interface StatementMember {
  id: number;
  name: string;
  member_id: string;
}

export interface StatementFilters {
  date_from?: string;
  date_to?: string;
}

export interface SavingsStatementTransaction {
  id: number;
  date: string;
  reference: string;
  description: string;
  account_id: number;
  account_number: string;
  direction: 'in' | 'out' | 'adj';
  type: 'credit' | 'debit';
  credit: number;
  debit: number;
  amount: number;
  balance: number;
}

export interface SavingsStatement {
  member: StatementMember;
  currency: StatementCurrency;
  accounts: { id: number; account_number: string; product_name: string; state: string; balance: number }[];
  account_id: number | null;
  date_from: string | null;
  date_to: string | null;
  opening_balance: number;
  total_credits: number;
  total_debits: number;
  closing_balance: number;
  transactions: SavingsStatementTransaction[];
}

export interface LoanStatementTransaction {
  date: string;
  reference: string;
  description: string;
  type: 'disbursement' | 'topup' | 'repayment' | 'interest' | 'adjustment';
  debit: number;
  credit: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface LoanSummary {
  id: number;
  name: string;
  type: string;
  state: string;
  disbursed_amount: number;
  outstanding_balance: number;
  start_date?: string | null;
  apr_percent?: number;
}

export interface LoanStatement {
  member: StatementMember;
  currency: StatementCurrency;
  loans: LoanSummary[];
  loan: LoanSummary | null;
  date_from: string | null;
  date_to: string | null;
  opening_balance: number;
  total_debits: number;
  total_credits: number;
  closing_balance: number;
  transactions: LoanStatementTransaction[];
}

const rpc = async <T,>(url: string, params: Record<string, unknown>): Promise<T> => {
  // Drop empty filters so the backend applies its defaults
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''));
  const response = await api.post(url, { jsonrpc: '2.0', method: 'call', params: clean });
  const data = response.data;
  if (data?.error) {
    throw new Error(data.error.data?.message || data.error.message || 'Request failed');
  }
  if (data?.result?.success === false) {
    throw new Error(data.result.message || 'Request failed');
  }
  return data.result as T;
};

export const fetchSavingsStatement = (accountId?: number, filters: StatementFilters = {}) =>
  rpc<SavingsStatement>('/api/portal/savings_statement', { account_id: accountId, ...filters });

export const fetchLoanStatement = (loanId?: number, filters: StatementFilters = {}) =>
  rpc<LoanStatement>('/api/portal/loan_statement', { loan_id: loanId, ...filters });

export const formatMoney = (value: number, symbol = '₦') =>
  `${symbol}${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0)}`;
