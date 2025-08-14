import { View } from 'react-native'
import { fn } from 'storybook/test'

import { Icon } from '@/components/generic/atoms/Icon'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Atoms/Icon',
  component: Icon,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ['heart', 'star', 'home', 'account', 'cog', 'bell', 'calendar', 'map-marker', 'share', 'download', 'search', 'menu', 'close', 'check', 'plus', 'minus'],
    },
    size: {
      control: { type: 'range', min: 12, max: 48, step: 4 },
    },
    color: {
      control: { type: 'color' },
    },
  },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'heart',
    size: 24,
    color: '#ff0000',
  },
}

export const CommonIcons: Story = {
  args: {
    name: 'heart',
    size: 24,
    color: '#ff0000',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Icon name="heart" size={24} color="#ff0000" />
      <Icon name="star" size={24} color="#ffd700" />
      <Icon name="home" size={24} color="#000000" />
      <Icon name="account" size={24} color="#000000" />
      <Icon name="cog" size={24} color="#000000" />
      <Icon name="bell" size={24} color="#000000" />
      <Icon name="calendar" size={24} color="#000000" />
      <Icon name="map-marker" size={24} color="#000000" />
    </View>
  ),
}

export const DifferentSizes: Story = {
  args: {
    name: 'heart',
    size: 24,
    color: '#ff0000',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Icon name="heart" size={16} color="#ff0000" />
      <Icon name="heart" size={24} color="#ff0000" />
      <Icon name="heart" size={32} color="#ff0000" />
      <Icon name="heart" size={48} color="#ff0000" />
    </View>
  ),
}

export const DifferentColors: Story = {
  args: {
    name: 'star',
    size: 24,
    color: '#ff0000',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Icon name="star" size={24} color="#ff0000" />
      <Icon name="star" size={24} color="#00ff00" />
      <Icon name="star" size={24} color="#0000ff" />
      <Icon name="star" size={24} color="#ffff00" />
      <Icon name="star" size={24} color="#ff00ff" />
      <Icon name="star" size={24} color="#00ffff" />
    </View>
  ),
}

export const Interactive: Story = {
  args: {
    name: 'heart',
    size: 24,
    color: '#ff0000',
    onPress: fn(),
  },
}
