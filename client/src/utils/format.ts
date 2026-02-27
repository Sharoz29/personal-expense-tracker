export function formatPKR(amount: number): string {
  return `PKR ${amount.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
