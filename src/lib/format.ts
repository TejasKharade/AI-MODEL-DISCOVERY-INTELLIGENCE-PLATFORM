export function compactNumber(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value % 1_000_000 ? 1 : 0)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(value % 1_000 ? 0 : 0)}K`;
  return String(value);
}

export function price(value: number | null) {
  if (value === null) return "—";
  if (value < 1) return `$${value.toFixed(value < 0.1 ? 3 : 2)}`;
  return `$${value.toFixed(2)}`;
}

export function date(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(value));
}
