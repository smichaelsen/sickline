import type { Meta, StoryObj } from "@storybook/react";
import { DailyHealthCheck } from "./DailyHealthCheck";

const meta: Meta<typeof DailyHealthCheck> = {
  title: "Components/DailyHealthCheck",
  component: DailyHealthCheck,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof DailyHealthCheck>;

const MEMBERS = [
  { id: "1", name: "Alice", color: "#22c55e" },
  { id: "2", name: "Bob", color: "#3b82f6" },
  { id: "3", name: "Charlie", color: "#f97316" },
];

const EMPTY_STATUS = { date: "2026-03-19", entries: [] };

function makeFetchMock(handlers: Record<string, unknown>) {
  return (url: string) => {
    const path = url.split("?")[0];
    const body = handlers[path] ?? handlers["*"];
    if (body === "hang") return new Promise(() => {});
    if (body instanceof Error) return Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) });
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(body),
    });
  };
}

export const WithMembers: Story = {
  decorators: [
    (Story) => {
      globalThis.fetch = makeFetchMock({
        "/api/members": MEMBERS,
        "/api/status": EMPTY_STATUS,
      }) as typeof fetch;
      return <Story />;
    },
  ],
};

export const WithPrefilled: Story = {
  decorators: [
    (Story) => {
      const entries = [
        { id: "e1", memberId: "1", status: "green",  title: "All good",  comment: "",         createdAt: "", updatedAt: "" },
        { id: "e2", memberId: "2", status: "yellow", title: "Headache",  comment: "Mild",     createdAt: "", updatedAt: "" },
        { id: "e3", memberId: "3", status: "red",    title: "Flu",       comment: "Fever 38°", createdAt: "", updatedAt: "" },
      ];
      globalThis.fetch = makeFetchMock({
        "/api/members": MEMBERS,
        "/api/status": { date: "2026-03-19", entries },
      }) as typeof fetch;
      return <Story />;
    },
  ],
};

export const NoMembers: Story = {
  decorators: [
    (Story) => {
      globalThis.fetch = makeFetchMock({
        "/api/members": [],
        "/api/status": EMPTY_STATUS,
      }) as typeof fetch;
      return <Story />;
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      globalThis.fetch = makeFetchMock({ "*": "hang" }) as typeof fetch;
      return <Story />;
    },
  ],
};

export const MembersError: Story = {
  decorators: [
    (Story) => {
      globalThis.fetch = (() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({}),
        })) as typeof fetch;
      return <Story />;
    },
  ],
};
