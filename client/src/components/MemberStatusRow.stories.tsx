import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { MemberStatusRow, type MemberRowState } from "./MemberStatusRow";

const meta: Meta<typeof MemberStatusRow> = {
  title: "Components/MemberStatusRow",
  component: MemberStatusRow,
  tags: ["autodocs"],
  argTypes: {
    onChange: { action: "changed" },
  },
};

export default meta;

type Story = StoryObj<typeof MemberStatusRow>;

// Wrapper that holds state so the traffic-light buttons are interactive
function Controlled(props: Omit<React.ComponentProps<typeof MemberStatusRow>, "onChange">) {
  const [value, setValue] = useState<MemberRowState>(props.value);
  return <MemberStatusRow {...props} value={value} onChange={setValue} />;
}

export const Green: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    name: "Alice",
    color: "#22c55e",
    value: { status: "green", title: "", comment: "" },
  },
};

export const Yellow: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    name: "Bob",
    color: "#facc15",
    value: { status: "yellow", title: "Headache", comment: "" },
  },
};

export const Red: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    name: "Charlie",
    color: "#ef4444",
    value: { status: "red", title: "Flu", comment: "Fever since yesterday" },
  },
};

export const NoColor: Story = {
  render: (args) => <Controlled {...args} />,
  args: {
    name: "Dana",
    color: null,
    value: { status: "green", title: "", comment: "" },
  },
};
