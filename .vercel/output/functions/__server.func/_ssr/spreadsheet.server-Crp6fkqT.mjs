async function spreadsheetToText(fileBase64, fileType) {
  if (fileType === "csv") {
    return Buffer.from(fileBase64, "base64").toString("utf-8");
  }
  const XLSX = await import("../_libs/xlsx.mjs");
  const buffer = Buffer.from(fileBase64, "base64");
  const wb = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_csv(sheet);
}
export {
  spreadsheetToText
};
