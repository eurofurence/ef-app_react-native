import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View, Text } from 'react-native'

import { Tab } from '@/components/generic/containers/Tab'

const meta = {
  title: 'Components/Containers/Tab',
  component: Tab,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: { type: 'select' },
      options: ['home', 'star', 'cog', 'plus', 'minus', 'check'],
    },
    text: {
      control: { type: 'text' },
    },
    active: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    inverted: {
      control: { type: 'boolean' },
    },
    indicate: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Tab>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'home',
    text: 'Home',
  },
}

export const Active: Story = {
  args: {
    icon: 'home',
    text: 'Home',
    active: true,
  },
}

export const Disabled: Story = {
  args: {
    icon: 'home',
    text: 'Home',
    disabled: true,
  },
}

export const WithIndicator: Story = {
  args: {
    icon: 'home',
    text: 'Home',
    indicate: true,
  },
}

export const Inverted: Story = {
  args: {
    icon: 'home',
    text: 'Home',
    inverted: true,
  },
}

export const ActiveInverted: Story = {
  args: {
    icon: 'home',
    text: 'Home',
    active: true,
    inverted: true,
  },
}

export const DifferentIcons: Story = {
  args: {
    icon: 'home',
    text: 'Sample Tab',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Tab icon="home" text="Home" />
      <Tab icon="star" text="Starred" />
      <Tab icon="cog" text="Settings" />
      <Tab icon="plus" text="Add" />
      <Tab icon="minus" text="Remove" />
    </View>
  ),
}

export const ActiveStates: Story = {
  args: {
    icon: 'home',
    text: 'Sample Tab',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Tab icon="home" text="Inactive Tab" />
      <Tab icon="star" text="Active Tab" active={true} />
      <Tab icon="cog" text="Disabled Tab" disabled={true} />
    </View>
  ),
}

export const WithIndicators: Story = {
  args: {
    icon: 'home',
    text: 'Sample Tab',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Tab icon="home" text="No Indicator" />
      <Tab icon="star" text="With Indicator" indicate={true} />
      <Tab icon="cog" text="Custom Indicator" indicate={<Text style={{ color: 'white', fontSize: 10 }}>3</Text>} />
    </View>
  ),
}

export const InvertedStates: Story = {
  args: {
    icon: 'home',
    text: 'Sample Tab',
  },
  render: () => (
    <View style={{ gap: 15, backgroundColor: '#333', padding: 15, borderRadius: 8 }}>
      <Tab icon="home" text="Normal Inverted" inverted={true} />
      <Tab icon="star" text="Active Inverted" active={true} inverted={true} />
      <Tab icon="cog" text="Disabled Inverted" disabled={true} inverted={true} />
    </View>
  ),
}
