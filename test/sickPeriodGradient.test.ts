import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { BAR_HEIGHT_PX, buildGradient, parseDate } from "../client/src/components/sickPeriodGradient";

// Helpers to reduce repetition
const d = parseDate;

describe("buildGradient", () => {
  it("returns undefined when severityPeriods is empty", () => {
    const start = d("2024-01-01");
    const end = d("2024-01-05");
    assert.equal(buildGradient([], start, end, 5, 32), undefined);
  });

  it("basic single-segment gradient", () => {
    // 5-day period, one yellow segment covering the whole period
    const start = d("2024-01-01");
    const end = d("2024-01-05");
    const result = buildGradient(
      [{ startDate: "2024-01-01", endDate: "2024-01-05", status: "yellow" }],
      start,
      end,
      5,
      32
    );
    // segStart=0, segEnd=4, clampedEnd=4, totalPx=160, endPx=(4+1)*32=160
    // No next → solidEnd=160, no fill-to-end (endPx==totalPx)
    assert.equal(result, "linear-gradient(90deg, #f59e0b 0px, #f59e0b 160px)");
  });

  it("multi-segment with fade between segments", () => {
    // 5-day period: red days 1-2, yellow days 3-5
    const start = d("2024-01-01");
    const end = d("2024-01-05");
    const result = buildGradient(
      [
        { startDate: "2024-01-01", endDate: "2024-01-02", status: "red" },
        { startDate: "2024-01-03", endDate: "2024-01-05", status: "yellow" }
      ],
      start,
      end,
      5,
      32
    );
    // seg0 red: segStart=0, clampedEnd=1, startPx=0, endPx=64, fadePx=8, solidEnd=56
    //   → "#ef4444 0px", "#ef4444 56px", "#f59e0b 64px"
    // seg1 yellow: segStart=2, clampedEnd=4, startPx=64, endPx=160, solidEnd=160
    //   → "#f59e0b 64px", "#f59e0b 160px"
    assert.equal(
      result,
      "linear-gradient(90deg, #ef4444 0px, #ef4444 56px, #f59e0b 64px, #f59e0b 64px, #f59e0b 160px)"
    );
  });

  it("segment endDate beyond period end is clamped to period bounds", () => {
    // 3-day period, segment claims to end on day 10
    const start = d("2024-01-01");
    const end = d("2024-01-03");
    const result = buildGradient(
      [{ startDate: "2024-01-01", endDate: "2024-01-10", status: "red" }],
      start,
      end,
      3,
      32
    );
    // clampedEnd = min(2, max(0, 9)) = 2, so endPx = (2+1)*32 = 96 = totalPx
    assert.equal(result, "linear-gradient(90deg, #ef4444 0px, #ef4444 96px)");
  });

  it("last-segment fill-to-end when segment ends before period width", () => {
    // 5-day period, segment only covers first 3 days → fill rule extends to totalPx
    const start = d("2024-01-01");
    const end = d("2024-01-05");
    const result = buildGradient(
      [{ startDate: "2024-01-01", endDate: "2024-01-03", status: "yellow" }],
      start,
      end,
      5,
      32
    );
    // clampedEnd=2, endPx=(2+1)*32=96, totalPx=5*32=160
    // endPx(96) < totalPx(160) → extra stop "#f59e0b 160px"
    assert.equal(result, "linear-gradient(90deg, #f59e0b 0px, #f59e0b 96px, #f59e0b 160px)");
  });

  it("single-day period uses BAR_HEIGHT_PX as effectiveScale", () => {
    // 1-day period → effectiveScale should be BAR_HEIGHT_PX (40), totalDays=1
    const start = d("2024-01-01");
    const end = d("2024-01-01");
    const result = buildGradient(
      [{ startDate: "2024-01-01", endDate: "2024-01-01", status: "red" }],
      start,
      end,
      1,
      BAR_HEIGHT_PX
    );
    // segStart=0, clampedEnd=0, startPx=0, endPx=(0+1)*40=40, totalPx=40
    assert.equal(result, "linear-gradient(90deg, #ef4444 0px, #ef4444 40px)");
  });
});
