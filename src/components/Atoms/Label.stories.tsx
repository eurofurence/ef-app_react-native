import { ComponentMeta, ComponentStory, Story } from "@storybook/react";

import { Label } from "./Label";

export default {
    component: Label,
} as ComponentMeta<typeof Label>;

export const Default: ComponentStory<typeof Label & { text: string }> = ({ ...args }) => <Label {...args}>Hello World</Label>;
Default.argTypes = {
    icon: {
        defaultValue: undefined,
        control: "text",
    },
    color: {
        defaultValue: undefined,
        control: "color",
    },
    ml: {
        defaultValue: 20,
        control: "number",
    },
    mt: {
        defaultValue: 20,
        control: "number",
    },
    mr: {
        defaultValue: 20,
        control: "number",
    },
    mb: {
        defaultValue: 20,
        control: "number",
    },
    variant: {
        defaultValue: "regular",
    },
    type: {
        defaultValue: "regular",
    },
};
