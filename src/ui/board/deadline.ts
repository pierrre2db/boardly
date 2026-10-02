import { todayISO } from "@/lib/date";

// Deadline urgency for a date cell, used to tint the Table view.
//   overdue → échéance dépassée (rouge)
//   soon    → ≤ 7 jours restants, aujourd'hui inclus (orange)
//   ok      → plus de 7 jours (vert)
export type DeadlineStatus = "overdue" | "soon" | "ok";

export const SOON_DAYS = 7;

// Whole days from `today` to an ISO date (YYYY-MM-DD), date-only.
// >0 future, 0 today, <0 past. NaN when unparseable.
export function daysUntil(dateISO: string, today: string = todayISO()): number {
  const target = Date.parse(`${dateISO}T00:00:00`);
  const base = Date.parse(`${today}T00:00:00`);
  if (Number.isNaN(target) || Number.isNaN(base)) return NaN;
  return Math.round((target - base) / 86_400_000);
}

export function deadlineStatus(
  dateISO: string | null | undefined,
  today: string = todayISO(),
): DeadlineStatus | null {
  if (!dateISO) return null;
  const d = daysUntil(dateISO, today);
  if (Number.isNaN(d)) return null;
  if (d < 0) return "overdue";
  if (d <= SOON_DAYS) return "soon";
  return "ok";
}
