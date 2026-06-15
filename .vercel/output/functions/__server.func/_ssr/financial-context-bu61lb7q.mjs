import { s as supabase } from "./client-BHmQHd0X.mjs";
async function buildFinancialSnapshot() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const monthStart = /* @__PURE__ */ new Date();
  monthStart.setDate(1);
  const monthStartStr = monthStart.toISOString().slice(0, 10);
  const [profile, accounts, txns, goals, loans, investments, score] = await Promise.all([
    supabase.from("profiles").select("name,monthly_income,occupation,employer").eq("id", user.id).maybeSingle(),
    supabase.from("bank_accounts").select("account_name,account_type,balance,outstanding_balance"),
    supabase.from("transactions").select("date,merchant_name,category,type,amount").gte("date", monthStartStr).order("date", { ascending: false }),
    supabase.from("goals").select("name,target_amount,current_amount,deadline"),
    supabase.from("loans").select("name,principal,outstanding,emi_amount,interest_rate"),
    supabase.from("investments").select("name,type,current_value,invested_amount"),
    supabase.from("financial_health_scores").select("total_score,savings_score,debt_score,emergency_score,investment_score,calculated_at").order("calculated_at", { ascending: false }).limit(1).maybeSingle()
  ]);
  const monthTxns = txns.data ?? [];
  const monthExpense = monthTxns.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
  const profileIncome = Number(profile.data?.monthly_income ?? 0);
  const creditIncome = monthTxns.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const monthIncome = profileIncome > 0 ? profileIncome : creditIncome;
  const savingsRate = monthIncome > 0 ? Math.max(0, Math.round((monthIncome - monthExpense) / monthIncome * 100)) : 0;
  const byCat = {};
  monthTxns.filter((t) => t.type === "debit").forEach((t) => {
    const c = t.category || "Other";
    byCat[c] = (byCat[c] || 0) + Number(t.amount);
  });
  const { data: recentTxns } = await supabase.from("transactions").select("date,merchant_name,category,type,amount").order("date", { ascending: false }).limit(25);
  return {
    profile: profile.data,
    totalBalance: (accounts.data ?? []).reduce((s, a) => s + Number(a.balance ?? 0), 0),
    totalInvestments: (investments.data ?? []).reduce((s, i) => s + Number(i.current_value ?? 0), 0),
    totalLoanOutstanding: (loans.data ?? []).reduce((s, l) => s + Number(l.outstanding ?? 0), 0),
    totalEmi: (loans.data ?? []).reduce((s, l) => s + Number(l.emi_amount ?? 0), 0),
    accounts: (accounts.data ?? []).map((a) => ({
      account_name: a.account_name,
      account_type: a.account_type,
      balance: a.balance,
      outstanding_balance: a.outstanding_balance
    })),
    thisMonth: { income: monthIncome, expense: monthExpense, savingsRate, byCategory: byCat },
    recentTransactions: recentTxns ?? [],
    goals: goals.data ?? [],
    loans: loans.data ?? [],
    investments: investments.data ?? [],
    healthScore: score.data
  };
}
function snapshotToJson(snapshot) {
  return JSON.stringify(snapshot);
}
export {
  buildFinancialSnapshot as b,
  snapshotToJson as s
};
