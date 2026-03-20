import type { Meta, StoryObj } from "@storybook/react";
import { TimelineView } from "./TimelineView";

const meta: Meta<typeof TimelineView> = {
  title: "Screens/TimelineView",
  component: TimelineView,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen"
  }
};

export default meta;

type Story = StoryObj<typeof TimelineView>;

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const ago = (days: number) => fmt(new Date(today.getTime() - days * 86_400_000));

const MEMBERS = [
  { id: "alice", name: "Alice", color: "#3b82f6" },
  { id: "bob", name: "Bob", color: "#10b981" },
  { id: "charlie", name: "Charlie", color: "#f59e0b" }
];

const SICK_PERIODS = {
  periods: [
    {
      memberId: "alice",
      startDate: ago(45),
      endDate: ago(38),
      status: "red",
      title: "Flu",
      severityPeriods: [
        { startDate: ago(45), endDate: ago(42), status: "red" },
        { startDate: ago(41), endDate: ago(38), status: "yellow" }
      ],
      comments: [
        { date: ago(44), comment: "High fever, staying home" },
        { date: ago(40), comment: "Improving, still resting" }
      ]
    },
    {
      memberId: "alice",
      startDate: ago(10),
      endDate: ago(7),
      status: "yellow",
      title: "Cold",
      severityPeriods: [{ startDate: ago(10), endDate: ago(7), status: "yellow" }],
      comments: [{ date: ago(9), comment: "Mild symptoms" }]
    },
    {
      memberId: "bob",
      startDate: ago(20),
      endDate: ago(12),
      status: "red",
      title: "RSV",
      severityPeriods: [
        { startDate: ago(20), endDate: ago(16), status: "yellow" },
        { startDate: ago(15), endDate: ago(12), status: "red" }
      ],
      comments: [
        { date: ago(19), comment: "Started coughing" },
        { date: ago(14), comment: "Doctor visit, RSV confirmed" }
      ]
    },
    {
      memberId: "charlie",
      startDate: ago(5),
      endDate: null,
      status: "yellow",
      title: "Ongoing",
      severityPeriods: [{ startDate: ago(5), endDate: fmt(today), status: "yellow" }],
      comments: [{ date: ago(4), comment: "Runny nose, low energy" }]
    }
  ]
};

function makeFetchMock(handlers: Record<string, unknown>) {
  return (url: string) => {
    const path = (url as string).split("?")[0];
    const body = handlers[path] ?? handlers["*"];
    if (body === "hang") return new Promise(() => {});
    if (body instanceof Error)
      return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) });
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(body) });
  };
}

export const WithData: Story = {
  decorators: [
    (Story) => {
      globalThis.fetch = makeFetchMock({
        "/api/members": MEMBERS,
        "/api/sick-periods": SICK_PERIODS
      }) as typeof fetch;
      return <Story />;
    }
  ]
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      globalThis.fetch = makeFetchMock({ "*": "hang" }) as typeof fetch;
      return <Story />;
    }
  ]
};

export const Empty: Story = {
  decorators: [
    (Story) => {
      globalThis.fetch = makeFetchMock({
        "/api/members": [],
        "/api/sick-periods": { periods: [] }
      }) as typeof fetch;
      return <Story />;
    }
  ]
};

export const NoPeriodsYet: Story = {
  decorators: [
    (Story) => {
      globalThis.fetch = makeFetchMock({
        "/api/members": MEMBERS,
        "/api/sick-periods": { periods: [] }
      }) as typeof fetch;
      return <Story />;
    }
  ]
};
