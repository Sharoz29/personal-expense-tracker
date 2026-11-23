import type { ReferenceRange } from "../types";

export function parseReferenceRanges(json: string | null): ReferenceRange[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

/**
 * Find the matching reference range for a given value.
 * For numeric markers: checks if value falls within min/max bounds.
 * For text markers: checks if text_value matches the range's value.
 */
export function findMatchingRange(
  ranges: ReferenceRange[],
  markerType: "numeric" | "text",
  numericValue: number | null,
  textValue: string | null
): ReferenceRange | null {
  if (ranges.length === 0) return null;

  if (markerType === "text") {
    return ranges.find((r) => r.value === textValue) ?? null;
  }

  // Numeric: find the range that the value falls into
  const val = numericValue ?? 0;
  for (const range of ranges) {
    const minOk = range.min == null || val >= range.min;
    const maxOk = range.max == null || val < range.max;
    if (minOk && maxOk) return range;
  }
  return null;
}

/**
 * Get the CSS text color class for a result, considering tiered ranges first,
 * then falling back to simple min/max or normal_value checks.
 */
export function getResultColor(opts: {
  marker_type?: "numeric" | "text";
  value: number | null;
  text_value: string | null;
  min_reference: number | null;
  max_reference: number | null;
  normal_value: string | null;
  reference_ranges: string | null;
}): string {
  const ranges = parseReferenceRanges(opts.reference_ranges);
  const type = opts.marker_type ?? "numeric";

  // If tiered ranges exist, use them
  if (ranges.length > 0) {
    const match = findMatchingRange(ranges, type, opts.value, opts.text_value);
    if (!match) return "text-gray-800"; // No matching range
    if (match.color === "green") return "text-green-600";
    if (match.color === "yellow") return "text-yellow-600";
    if (match.color === "red") return "text-red-600";
    return "text-gray-800";
  }

  // Fallback to simple reference fields
  if (type === "text") {
    if (!opts.normal_value) return "text-gray-800";
    return opts.text_value === opts.normal_value ? "text-green-600" : "text-red-600";
  }

  if (opts.min_reference === null && opts.max_reference === null) return "text-gray-800";
  if (opts.min_reference !== null && (opts.value ?? 0) < opts.min_reference) return "text-red-600";
  if (opts.max_reference !== null && (opts.value ?? 0) > opts.max_reference) return "text-red-600";
  return "text-green-600";
}

/**
 * Get the display label for a result's status (e.g., "Desirable", "Borderline", "High").
 * Returns null if no tiered ranges or no match.
 */
export function getResultLabel(opts: {
  marker_type?: "numeric" | "text";
  value: number | null;
  text_value: string | null;
  reference_ranges: string | null;
}): string | null {
  const ranges = parseReferenceRanges(opts.reference_ranges);
  if (ranges.length === 0) return null;

  const type = opts.marker_type ?? "numeric";
  const match = findMatchingRange(ranges, type, opts.value, opts.text_value);
  return match?.label ?? null;
}

/**
 * Get the reference display text for a result row.
 * If tiered ranges exist, shows the matching range label.
 * Otherwise, shows the simple range or normal value.
 */
export function getReferenceDisplay(opts: {
  marker_type?: "numeric" | "text";
  value: number | null;
  text_value: string | null;
  min_reference: number | null;
  max_reference: number | null;
  normal_value: string | null;
  reference_ranges: string | null;
}): string {
  const ranges = parseReferenceRanges(opts.reference_ranges);

  if (ranges.length > 0) {
    const type = opts.marker_type ?? "numeric";
    const match = findMatchingRange(ranges, type, opts.value, opts.text_value);
    if (match) return match.label;
    // If no match, show all range labels as summary
    return ranges.map((r) => r.label).join(" / ");
  }

  // Fallback to simple fields
  const type = opts.marker_type ?? "numeric";
  if (type === "text") {
    return opts.normal_value ? `Normal: ${opts.normal_value}` : "—";
  }
  if (opts.min_reference !== null || opts.max_reference !== null) {
    return `${opts.min_reference ?? "—"} – ${opts.max_reference ?? "—"}`;
  }
  return "—";
}
