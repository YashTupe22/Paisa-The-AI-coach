export function formatINR(value: number | null | undefined, opts?: { compact?: boolean }): string {
  const n = Number(value ?? 0);
  if (opts?.compact && Math.abs(n) >= 100000) {
    if (Math.abs(n) >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    return `₹${(n / 100000).toFixed(2)} L`;
  }
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

export function formatNumber(value: number | null | undefined): string {
  return Number(value ?? 0).toLocaleString("en-IN");
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-IN", { month: "short" });
  return `${day} ${month} ${d.getFullYear()}`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(digits)}%`;
}

export function classNames(...cls: Array<string | false | null | undefined>): string {
  return cls.filter(Boolean).join(" ");
}
