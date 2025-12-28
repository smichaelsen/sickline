import type { Meta, StoryObj } from "@storybook/react";
import { SickPeriod } from "./SickPeriod";

const meta: Meta<typeof SickPeriod> = {
  title: "Components/SickPeriod",
  component: SickPeriod,
  tags: ["autodocs"]
};

export default meta;

type Story = StoryObj<typeof SickPeriod>;

const today = new Date();
const format = (d: Date) => d.toISOString().slice(0, 10);

export const RedPeriod: Story = {
  args: {
    startDate: "2024-01-01",
    endDate: "2024-01-05",
    title: "Flu",
    severityPeriods: [{ startDate: "2024-01-01", endDate: "2024-01-05", status: "red" }]
  }
};

export const YellowPeriod: Story = {
  args: {
    startDate: "2024-02-01",
    endDate: "2024-02-04",
    title: "Recovery",
    severityPeriods: [{ startDate: "2024-02-01", endDate: "2024-02-04", status: "yellow" }]
  }
};

export const MixedSeverities: Story = {
  args: {
    startDate: "2024-03-01",
    endDate: "2024-03-07",
    title: "RSV",
    severityPeriods: [
      { startDate: "2024-03-01", endDate: "2024-03-03", status: "red" },
      { startDate: "2024-03-04", endDate: "2024-03-07", status: "yellow" }
    ]
  }
};

export const OpenEnded: Story = {
  args: {
    startDate: format(new Date(today.getTime() - 3 * 86_400_000)),
    title: "Ongoing",
    severityPeriods: [{ startDate: format(new Date(today.getTime() - 3 * 86_400_000)), status: "yellow" }],
    pxPerDay: 18
  }
};

export const WithComments: Story = {
  args: {
    startDate: "2024-04-01",
    endDate: "2024-04-06",
    title: "Cold",
    severityPeriods: [
      { startDate: "2024-04-01", endDate: "2024-04-02", status: "yellow" },
      { startDate: "2024-04-03", endDate: "2024-04-06", status: "red" }
    ],
    comments: [
      { date: "2024-04-01", comment: "Sore throat" },
      { date: "2024-04-03", comment: "Fever" },
      { date: "2024-04-06", comment: "Recovering" }
    ],
    pxPerDay: 14
  }
};

export const YellowRedYellowSequence: Story = {
  args: {
    startDate: "2024-05-01",
    endDate: "2024-05-14",
    title: "Two-week swing",
    severityPeriods: [
      { startDate: "2024-05-01", endDate: "2024-05-05", status: "yellow" },
      { startDate: "2024-05-06", endDate: "2024-05-10", status: "red" },
      { startDate: "2024-05-11", endDate: "2024-05-14", status: "yellow" }
    ],
    comments: [
      { date: "2024-05-03", comment: "Mild symptoms" },
      { date: "2024-05-08", comment: "Peak fever" },
      { date: "2024-05-13", comment: "Improving" }
    ],
    pxPerDay: 12
  }
};

export const SingleDayYellowWithComment: Story = {
  args: {
    startDate: "2024-06-10",
    endDate: "2024-06-10",
    severityPeriods: [{ startDate: "2024-06-10", endDate: "2024-06-10", status: "yellow" }],
    comments: [{ date: "2024-06-10", comment: "Mild headache" }],
    pxPerDay: 18
  }
};
