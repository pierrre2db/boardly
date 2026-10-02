import { describe, it, expect } from "vitest";
import { deadlineStatus, daysUntil } from "./deadline";

const today = "2026-10-02";

describe("deadlineStatus", () => {
  it("overdue when the date is in the past", () => {
    expect(deadlineStatus("2026-10-01", today)).toBe("overdue");
    expect(deadlineStatus("2026-09-01", today)).toBe("overdue");
  });
  it("soon when today or within 7 days", () => {
    expect(deadlineStatus("2026-10-02", today)).toBe("soon"); // today
    expect(deadlineStatus("2026-10-05", today)).toBe("soon"); // +3
    expect(deadlineStatus("2026-10-09", today)).toBe("soon"); // +7 boundary
  });
  it("ok beyond 7 days", () => {
    expect(deadlineStatus("2026-10-10", today)).toBe("ok"); // +8
    expect(deadlineStatus("2027-01-01", today)).toBe("ok");
  });
  it("null for empty/invalid input", () => {
    expect(deadlineStatus(null, today)).toBeNull();
    expect(deadlineStatus(undefined, today)).toBeNull();
    expect(deadlineStatus("", today)).toBeNull();
    expect(deadlineStatus("not-a-date", today)).toBeNull();
  });
});

describe("daysUntil", () => {
  it("counts whole days, signed", () => {
    expect(daysUntil("2026-10-09", today)).toBe(7);
    expect(daysUntil("2026-10-02", today)).toBe(0);
    expect(daysUntil("2026-10-01", today)).toBe(-1);
  });
});
