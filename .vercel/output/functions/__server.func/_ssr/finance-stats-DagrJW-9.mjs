const EXPENSE_CATEGORIES = ["Food & Dining", "Transport", "Shopping", "Utilities", "Entertainment", "EMI", "Investment", "Transfer", "Other"];
function computePeriodStats(txns, profileMonthlyIncome = 0) {
  const debits = txns.filter((t) => t.type === "debit");
  const credits = txns.filter((t) => t.type === "credit");
  const expense = debits.reduce((s, t) => s + Number(t.amount), 0);
  const creditIncome = credits.reduce((s, t) => s + Number(t.amount), 0);
  const income = profileMonthlyIncome > 0 ? profileMonthlyIncome : creditIncome;
  const savings = income - expense;
  const savingsRate = income > 0 ? Math.max(0, Math.round(savings / income * 100)) : 0;
  const byCat = {};
  const byMerchant = {};
  debits.forEach((t) => {
    const c = t.category || "Other";
    byCat[c] = (byCat[c] || 0) + Number(t.amount);
    const m = t.merchant_name || "Unknown";
    byMerchant[m] = (byMerchant[m] || 0) + Number(t.amount);
  });
  const investmentOutflow = debits.filter((t) => (t.category || "").toLowerCase() === "investment").reduce((s, t) => s + Number(t.amount), 0);
  const emiOutflow = debits.filter((t) => (t.category || "").toLowerCase() === "emi").reduce((s, t) => s + Number(t.amount), 0);
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
    txnCount: txns.length
  };
}
function monthRange(month) {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(y, m - 1, 1).toISOString().slice(0, 10);
  const end = new Date(y, m, 0).toISOString().slice(0, 10);
  return { start, end };
}
function currentMonthKey() {
  const d = /* @__PURE__ */ new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
export {
  EXPENSE_CATEGORIES as E,
  currentMonthKey as a,
  computePeriodStats as c,
  monthRange as m
};
