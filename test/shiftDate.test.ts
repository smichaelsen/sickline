import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shiftDate } from "../client/src/dateUtils";

describe("shiftDate", () => {
  it("shifts forward by a positive offset", () => {
    assert.equal(shiftDate("2024-01-01", 1), "2024-01-02");
    assert.equal(shiftDate("2024-01-01", 7), "2024-01-08");
  });

  it("shifts backward by a negative offset", () => {
    assert.equal(shiftDate("2024-01-10", -1), "2024-01-09");
    assert.equal(shiftDate("2024-03-01", -30), "2024-01-31");
  });

  it("returns the same date for zero offset", () => {
    assert.equal(shiftDate("2024-06-15", 0), "2024-06-15");
  });

  it("crosses a DST boundary without off-by-one (EU spring-forward 2024-03-31)", () => {
    // Europe/Berlin clocks spring forward at 2024-03-31 02:00 → 03:00.
    // A naive midnight-local anchor can land on the wrong side of the clock
    // change and produce an off-by-one. The noon-UTC anchor (T12:00:00Z)
    // stays well clear of any DST transition regardless of the host timezone.
    assert.equal(shiftDate("2024-03-30", 1), "2024-03-31");
    assert.equal(shiftDate("2024-03-31", 1), "2024-04-01");
    assert.equal(shiftDate("2024-04-01", -1), "2024-03-31");
  });

  it("crosses a DST boundary without off-by-one (EU autumn fallback 2024-10-27)", () => {
    // Europe/Berlin clocks fall back at 2024-10-27 03:00 → 02:00.
    assert.equal(shiftDate("2024-10-26", 1), "2024-10-27");
    assert.equal(shiftDate("2024-10-27", 1), "2024-10-28");
    assert.equal(shiftDate("2024-10-28", -1), "2024-10-27");
  });
});
