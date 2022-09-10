import { Meta, Story } from "@storybook/react";

import { Label } from "./Label";

export default {
    component: Label,
} as Meta;

export const Default: Story = (args) => <Label {...args}>Hello World</Label>;
