export type TxnRow = {
  amount: number;
  type: string;
  category: string | null;
  merchant_name?: string | null;
  date: string;
};

export type PeriodStats = {
  income: number;
  creditIncome: number;
  expense: number;
  savings: number;
  savingsRate: number;
  byCategory: Array<{ name: string; value: number }>;
  byMerchant: Array<{ name: string; value: number }>;
  investmentOutflow: number;
  emiOutflow: number;
  txnCount: number;
};

const EXPENSE_CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Utilities", "Entertainment", "EMI", "Investment", "Transfer", "Other"];

export function computePeriodStats(txns: TxnRow[], profileMonthlyIncome = 0): PeriodStats {
  const debits = txns.filter((t) => t.type === "debit");
  const credits = txns.filter((t) => t.type === "credit");
  const expense = debits.reduce((s, t) => s + Number(t.amount), 0);
  const creditIncome = credits.reduce((s, t) => s + Number(t.amount), 0);
  const income = profileMonthlyIncome > 0 ? profileMonthlyIncome : creditIncome;
  const savings = income - expense;
  const savingsRate = income > 0 ? Math.max(0, Math.round((savings / income) * 100)) : 0;

  const byCat: Record<string, number> = {};
  const byMerchant: Record<string, number> = {};
  debits.forEach((t) => {
    const c = t.category || "Other";
    byCat[c] = (byCat[c] || 0) + Number(t.amount);
    const m = t.merchant_name || "Unknown";
    byMerchant[m] = (byMerchant[m] || 0) + Number(t.amount);
  });

  const investmentOutflow = debits
    .filter((t) => (t.category || "").toLowerCase() === "investment")
    .reduce((s, t) => s + Number(t.amount), 0);
  const emiOutflow = debits
    .filter((t) => (t.category || "").toLowerCase() === "emi")
    .reduce((s, t) => s + Number(t.amount), 0);

  return {
    income,
    creditIncome,
    expense,
    savings,
    savingsRate,
    byCategory: Object.entries(byCat).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    byMerchant: Object.entries(byMerchant).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    investmentOutflow,
    emiOutflow,
    txnCount: txns.length,
  };
}

export function monthRange(month: string): { start: string; end: string } {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(y, m - 1, 1).toISOString().slice(0, 10);
  const end = new Date(y, m, 0).toISOString().slice(0, 10);
  return { start, end };
}

export function currentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export { EXPENSE_CATEGORIES };
