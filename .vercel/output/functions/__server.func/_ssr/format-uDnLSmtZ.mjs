function formatINR(value, opts) {
  const n = Number(value ?? 0);
  if (opts?.compact && Math.abs(n) >= 1e5) {
    if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
    return `₹${(n / 1e5).toFixed(2)} L`;
  }
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}
function formatDate(date) {
  if (!date) return "—";
  const d = typeof date === "string" ? new Date(date) : date;
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("en-IN", { month: "short" });
  return `${day} ${month} ${d.getFullYear()}`;
}
export {
  formatINR as a,
  formatDate as f
};
