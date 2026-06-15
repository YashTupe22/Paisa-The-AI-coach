import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type HealthScoreResult = {
  total_score: number;
  savings_score: number;
  debt_score: number;
  emergency_score: number;
  investment_score: number;
  summary: string;
  insights: Array<{ type: string; heading: string; body: string; cta_label?: string; cta_url?: string }>;
};

const SYSTEM = `You are a financial health analyst for Indian users. Given a user's complete financial snapshot (JSON), compute a realistic financial health score from 0-100.

Return strict JSON:
{
  "total_score": 0-100,
  "savings_score": 0-100,
  "debt_score": 0-100,
  "emergency_score": 0-100,
  "investment_score": 0-100,
  "summary": "1-2 sentence overview",
  "insights": [
    {"type":"savings|debt|investment|goal|spending","heading":"short title","body":"actionable advice under 80 words","cta_label":"optional","cta_url":"/transactions|/goals|/investments|/emi"}
  ]
}

Scoring guidelines:
- savings_score: based on savings rate (income minus expenses / income). Target 20%+ = high score.
- debt_score: inverse of EMI burden and loan outstanding vs income. Lower debt = higher score.
- emergency_score: liquid balance vs monthly expenses. 3-6 months = high score.
- investment_score: investment value vs income and goals progress.
- total_score: weighted average (savings 30%, debt 25%, emergency 25%, investment 20%).

If data is sparse (no transactions, no accounts), score conservatively (20-40) and explain what's missing.
Use actual ₹ amounts from the data. Return ONLY JSON, no markdown.`;

async function fetchSnapshot(supabase: SupabaseClient<Database>, userId: string) {
  const monthStart = new Date();
  monthStart.setDate(1);
  const monthStartStr = monthStart.toISOString().slice(0, 10);

  const [profile, accounts, txns, goals, loans, investments] = await Promise.all([
    supabase.from("profiles").select("name,monthly_income,occupation,employer").eq("id", userId).maybeSingle(),
    supabase.from("bank_accounts").select("account_name,account_type,balance,outstanding_balance"),
    supabase.from("transactions").select("date,merchant_name,category,type,amount").gte("date", monthStartStr),
    supabase.from("goals").select("name,target_amount,current_amount,deadline,type"),
    supabase.from("loans").select("name,principal,outstanding,emi_amount,interest_rate"),
    supabase.from("investments").select("name,type,current_value,invested_amount,sip_amount"),
  ]);

  const monthTxns = txns.data ?? [];
  const monthExpense = monthTxns.filter((t) => t.type === "debit").reduce((s, t) => s + Number(t.amount), 0);
  const profileIncome = Number(profile.data?.monthly_income ?? 0);
  const creditIncome = monthTxns.filter((t) => t.type === "credit").reduce((s, t) => s + Number(t.amount), 0);
  const monthIncome = profileIncome > 0 ? profileIncome : creditIncome;
  const savingsRate = monthIncome > 0 ? Math.round(((monthIncome - monthExpense) / monthIncome) * 100) : 0;

  const byCat: Record<string, number> = {};
  monthTxns.filter((t) => t.type === "debit").forEach((t) => {
    const c = t.category || "Other";
    byCat[c] = (byCat[c] || 0) + Number(t.amount);
  });

  const { data: recentTxns } = await supabase
    .from("transactions")
    .select("date,merchant_name,category,type,amount")
    .order("date", { ascending: false })
    .limit(30);

  return {
    profile: profile.data,
    totalBalance: (accounts.data ?? []).reduce((s, a) => s + Number(a.balance ?? 0), 0),
    totalInvestments: (investments.data ?? []).reduce((s, i) => s + Number(i.current_value ?? 0), 0),
    totalLoanOutstanding: (loans.data ?? []).reduce((s, l) => s + Number(l.outstanding ?? 0), 0),
    totalEmi: (loans.data ?? []).reduce((s, l) => s + Number(l.emi_amount ?? 0), 0),
    accounts: accounts.data,
    thisMonth: { income: monthIncome, expense: monthExpense, savingsRate, byCategory: byCat },
    recentTransactions: recentTxns ?? [],
    goals: goals.data,
    loans: loans.data,
    investments: investments.data,
  };
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function computeBaseline(snapshot: Awaited<ReturnType<typeof fetchSnapshot>>): HealthScoreResult {
  const income = snapshot.thisMonth.income || 1;
  const expenses = snapshot.thisMonth.expense;
  const savingsRate = snapshot.thisMonth.savingsRate;

  const savings_score = clamp(savingsRate * 4); // 25% savings = 100
  const emiBurden = snapshot.totalEmi / income;
  const debt_score = clamp(100 - emiBurden * 200 - (snapshot.totalLoanOutstanding / (income * 12)) * 30);
  const monthsCovered = expenses > 0 ? snapshot.totalBalance / expenses : 0;
  const emergency_score = clamp(monthsCovered * 20); // 5 months = 100
  const investRate = snapshot.totalInvestments / (income * 12);
  const investment_score = clamp(investRate * 100);

  const total_score = clamp(savings_score * 0.3 + debt_score * 0.25 + emergency_score * 0.25 + investment_score * 0.2);

  return {
    total_score,
    savings_score,
    debt_score,
    emergency_score,
    investment_score,
    summary: `Based on your data: ${savingsRate}% savings rate, ${formatINR(snapshot.totalInvestments)} invested, ${formatINR(snapshot.totalEmi)}/mo EMI.`,
    insights: [],
  };
}

function formatINR(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

async function scoreWithGemini(snapshot: Awaited<ReturnType<typeof fetchSnapshot>>): Promise<HealthScoreResult | null> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;

  const body = {
    system_instruction: { parts: [{ text: SYSTEM }] },
    contents: [{ role: "user", parts: [{ text: `Analyze this financial snapshot and return the JSON score:\n${JSON.stringify(snapshot)}` }] }],
    generationConfig: { responseMimeType: "application/json" },
  };

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
    { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: JSON.stringify(body) },
  );
  if (!res.ok) return null;

  const json = await res.json();
  const content: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  let parsed: HealthScoreResult;
  try {
    parsed = JSON.parse(content);
  } catch {
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) return null;
    parsed = JSON.parse(m[0]);
  }

  return {
    total_score: clamp(parsed.total_score),
    savings_score: clamp(parsed.savings_score),
    debt_score: clamp(parsed.debt_score),
    emergency_score: clamp(parsed.emergency_score),
    investment_score: clamp(parsed.investment_score),
    summary: parsed.summary ?? "",
    insights: parsed.insights ?? [],
  };
}

export async function computeAndStoreHealthScore(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<HealthScoreResult> {
  const snapshot = await fetchSnapshot(supabase, userId);
  const baseline = computeBaseline(snapshot);
  const aiResult = await scoreWithGemini(snapshot);
  const result = aiResult ?? baseline;

  await supabase.from("financial_health_scores").insert({
    user_id: userId,
    total_score: result.total_score,
    savings_score: result.savings_score,
    debt_score: result.debt_score,
    emergency_score: result.emergency_score,
    investment_score: result.investment_score,
  });

  // Refresh AI insights (keep last 10)
  const insights = result.insights.length > 0 ? result.insights : [
    {
      type: "overview",
      heading: "Financial health update",
      body: result.summary || `Your score is ${result.total_score}/100. Add transactions and accounts for more accurate insights.`,
      cta_label: "View transactions",
      cta_url: "/transactions",
    },
  ];

  await supabase.from("ai_insights").delete().eq("user_id", userId);
  await supabase.from("ai_insights").insert(
    insights.slice(0, 5).map((i) => ({
      user_id: userId,
      type: i.type,
      heading: i.heading,
      body: i.body,
      cta_label: i.cta_label ?? null,
      cta_url: i.cta_url ?? null,
    })),
  );

  return result;
}
