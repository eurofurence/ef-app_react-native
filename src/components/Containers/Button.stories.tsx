import { ComponentMeta, Story } from "@storybook/react";

import { Button } from "./Button";

export default {
    component: Button,
    argTypes: {
        icon: {
            defaultValue: "send",
            type: "string",
        },
    },
} as ComponentMeta<typeof Button>;

export const Default: Story = (args) => <Button {...args}>Press Me</Button>;
