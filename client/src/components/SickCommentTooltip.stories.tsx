import type { Meta, StoryObj } from "@storybook/react";

import { SickCommentTooltip } from "./SickCommentTooltip";

const meta: Meta<typeof SickCommentTooltip> = {
  title: "Components/SickCommentTooltip",
  component: SickCommentTooltip
};

export default meta;

type Story = StoryObj<typeof SickCommentTooltip>;

export const Default: Story = {
  args: {
    date: "2024-04-13",
    comment:
      "Reported a mild fever and will stay home until the temperature normalizes; checking vitals twice a day and looping in the team if anything changes."
  }
};

export const MultilineComment: Story = {
  args: {
    date: "2024-04-15",
    comment:
      "Symptoms persisted into the evening.\nUpdated the doctor and awaiting further guidance before returning to the office."
  }
};
