/**
 * Format a date string (YYYY-MM-DD or ISO) to en-GB locale (DD/MM/YYYY).
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB");
}
