/** Converts CSV/XLS/XLSX to plain text for AI parsing. */

export async function spreadsheetToText(
  fileBase64: string,
  fileType: "csv" | "xlsx" | "xls",
): Promise<string> {
  if (fileType === "csv") {
    return Buffer.from(fileBase64, "base64").toString("utf-8");
  }

  const XLSX = await import("xlsx");
  const buffer = Buffer.from(fileBase64, "base64");
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_csv(sheet);
}
