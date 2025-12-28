import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { computeSickPeriods } from "../src/services/sickPeriods";

describe("computeSickPeriods", () => {
  it("merges consecutive and gapped entries with same status/title and extends to today when within 2 days", () => {
    const periods = computeSickPeriods(
      [
        { memberId: "a", date: "2024-01-01", status: "red", title: "flu", comment: "fever" },
        { memberId: "a", date: "2024-01-03", status: "red", title: "flu", comment: "cough" }
      ],
      { today: "2024-01-04" }
    );

    assert.deepStrictEqual(periods, [
      {
        memberId: "a",
        startDate: "2024-01-01",
        endDate: undefined,
        status: "red",
        title: "flu",
        severityPeriods: [
          { startDate: "2024-01-01", endDate: "2024-01-04", status: "red" }
        ],
        comments: [
          { date: "2024-01-01", comment: "fever" },
          { date: "2024-01-03", comment: "cough" }
        ]
      }
    ]);
  });

  it("splits on status or title changes and does not mark stale periods open-ended", () => {
    const periods = computeSickPeriods(
      [
        { memberId: "a", date: "2024-01-01", status: "red", title: "flu" },
        { memberId: "a", date: "2024-01-02", status: "yellow", title: "cold" },
        { memberId: "a", date: "2024-01-04", status: "yellow", title: "cold" },
        { memberId: "a", date: "2024-01-06", status: "red", title: "flu" }
      ],
      { today: "2024-01-10" }
    );

    assert.deepStrictEqual(periods, [
      {
        memberId: "a",
        startDate: "2024-01-01",
        endDate: "2024-01-01",
        status: "red",
        title: "flu",
        severityPeriods: [{ startDate: "2024-01-01", endDate: "2024-01-01", status: "red" }],
        comments: []
      },
      {
        memberId: "a",
        startDate: "2024-01-02",
        endDate: "2024-01-04",
        status: "yellow",
        title: "cold",
        severityPeriods: [{ startDate: "2024-01-02", endDate: "2024-01-04", status: "yellow" }],
        comments: []
      },
      {
        memberId: "a",
        startDate: "2024-01-06",
        endDate: "2024-01-06",
        status: "red",
        title: "flu",
        severityPeriods: [{ startDate: "2024-01-06", endDate: "2024-01-06", status: "red" }],
        comments: []
      }
    ]);
  });

  it("breaks periods on green entries and extends the latest period when recent", () => {
    const periods = computeSickPeriods(
      [
        { memberId: "b", date: "2024-01-01", status: "yellow", title: "fever" },
        { memberId: "b", date: "2024-01-02", status: "green", title: null },
        { memberId: "b", date: "2024-01-03", status: "yellow", title: "fever" }
      ],
      { today: "2024-01-04" }
    );

    assert.deepStrictEqual(periods, [
      {
        memberId: "b",
        startDate: "2024-01-01",
        endDate: "2024-01-01",
        status: "yellow",
        title: "fever",
        severityPeriods: [{ startDate: "2024-01-01", endDate: "2024-01-01", status: "yellow" }],
        comments: []
      },
      {
        memberId: "b",
        startDate: "2024-01-03",
        endDate: undefined,
        status: "yellow",
        title: "fever",
        severityPeriods: [{ startDate: "2024-01-03", endDate: "2024-01-04", status: "yellow" }],
        comments: []
      }
    ]);
  });

  it("returns empty when there are no sick entries", () => {
    const periods = computeSickPeriods(
      [
        { memberId: "c", date: "2024-01-01", status: "green", title: null },
        { memberId: "c", date: "2024-01-02", status: "green", title: null }
      ],
      { today: "2024-01-03" }
    );

    assert.deepStrictEqual(periods, []);
  });

  it("keeps one sick period with mixed severities under the same title and fills gaps", () => {
    const periods = computeSickPeriods(
      [
        { memberId: "d", date: "2024-02-01", status: "red", title: "flu" },
        { memberId: "d", date: "2024-02-03", status: "yellow", title: "flu" }
      ],
      { today: "2024-02-05" }
    );

    assert.deepStrictEqual(periods, [
      {
        memberId: "d",
        startDate: "2024-02-01",
        endDate: undefined,
        status: "yellow",
        title: "flu",
        severityPeriods: [
          { startDate: "2024-02-01", endDate: "2024-02-02", status: "red" },
          { startDate: "2024-02-03", endDate: "2024-02-05", status: "yellow" }
        ],
        comments: []
      }
    ]);
  });

  it("splits when gaps exceed 2 days even with same title/status", () => {
    const periods = computeSickPeriods(
      [
        { memberId: "e", date: "2024-02-01", status: "red", title: "flu" },
        { memberId: "e", date: "2024-02-04", status: "red", title: "flu" }
      ],
      { today: "2024-02-05" }
    );

    assert.deepStrictEqual(periods, [
      {
        memberId: "e",
        startDate: "2024-02-01",
        endDate: "2024-02-01",
        status: "red",
        title: "flu",
        severityPeriods: [{ startDate: "2024-02-01", endDate: "2024-02-01", status: "red" }],
        comments: []
      },
      {
        memberId: "e",
        startDate: "2024-02-04",
        endDate: undefined,
        status: "red",
        title: "flu",
        severityPeriods: [{ startDate: "2024-02-04", endDate: "2024-02-05", status: "red" }],
        comments: []
      }
    ]);
  });

  it("splits when title changes to null even with same severity", () => {
    const periods = computeSickPeriods(
      [
        { memberId: "f", date: "2024-03-01", status: "yellow", title: "cold" },
        { memberId: "f", date: "2024-03-02", status: "yellow", title: null }
      ],
      { today: "2024-03-03" }
    );

    assert.deepStrictEqual(periods, [
      {
        memberId: "f",
        startDate: "2024-03-01",
        endDate: "2024-03-01",
        status: "yellow",
        title: "cold",
        severityPeriods: [{ startDate: "2024-03-01", endDate: "2024-03-01", status: "yellow" }],
        comments: []
      },
      {
        memberId: "f",
        startDate: "2024-03-02",
        endDate: undefined,
        status: "yellow",
        title: null,
        severityPeriods: [{ startDate: "2024-03-02", endDate: "2024-03-03", status: "yellow" }],
        comments: []
      }
    ]);
  });

  it("splits when title changes with same severity", () => {
    const periods = computeSickPeriods(
      [
        { memberId: "g", date: "2024-04-01", status: "yellow", title: "cold" },
        { memberId: "g", date: "2024-04-02", status: "yellow", title: "flu" }
      ],
      { today: "2024-04-05" }
    );

    assert.deepStrictEqual(periods, [
      {
        memberId: "g",
        startDate: "2024-04-01",
        endDate: "2024-04-01",
        status: "yellow",
        title: "cold",
        severityPeriods: [{ startDate: "2024-04-01", endDate: "2024-04-01", status: "yellow" }],
        comments: []
      },
      {
        memberId: "g",
        startDate: "2024-04-02",
        endDate: "2024-04-02",
        status: "yellow",
        title: "flu",
        severityPeriods: [{ startDate: "2024-04-02", endDate: "2024-04-02", status: "yellow" }],
        comments: []
      }
    ]);
  });

  it("does not open-end stale periods older than 2 days", () => {
    const periods = computeSickPeriods(
      [{ memberId: "h", date: "2024-01-01", status: "red", title: "flu" }],
      { today: "2024-01-10" }
    );

    assert.deepStrictEqual(periods, [
      {
        memberId: "h",
        startDate: "2024-01-01",
        endDate: "2024-01-01",
        status: "red",
        title: "flu",
        severityPeriods: [{ startDate: "2024-01-01", endDate: "2024-01-01", status: "red" }],
        comments: []
      }
    ]);
  });
});
