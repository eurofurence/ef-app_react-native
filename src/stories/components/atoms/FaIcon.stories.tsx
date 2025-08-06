import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { FaIcon, FaIconNames } from '@/components/generic/atoms/FaIcon'

const meta = {
  title: 'Components/Atoms/FaIcon',
  component: FaIcon,
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
      options: ['home', 'user', 'heart', 'star', 'cog', 'search', 'plus', 'minus', 'check', 'times'],
    },
    size: {
      control: { type: 'range', min: 12, max: 48, step: 2 },
    },
    color: {
      control: { type: 'color' },
    },
  },
} satisfies Meta<typeof FaIcon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'home',
    size: 24,
    color: '#333',
  },
}

export const DifferentSizes: Story = {
  render: () => (
    <View style={{ gap: 15, alignItems: 'center' }}>
      <FaIcon name="home" size={16} color="#333" />
      <FaIcon name="home" size={24} color="#333" />
      <FaIcon name="home" size={32} color="#333" />
      <FaIcon name="home" size={48} color="#333" />
    </View>
  ),
}

export const DifferentIcons: Story = {
  render: () => (
    <View style={{ gap: 15, alignItems: 'center' }}>
      <FaIcon name="home" size={24} color="#333" />
      <FaIcon name="user" size={24} color="#333" />
      <FaIcon name="heart" size={24} color="#333" />
      <FaIcon name="star" size={24} color="#333" />
      <FaIcon name="cog" size={24} color="#333" />
      <FaIcon name="search" size={24} color="#333" />
    </View>
  ),
}

export const DifferentColors: Story = {
  render: () => (
    <View style={{ gap: 15, alignItems: 'center' }}>
      <FaIcon name="heart" size={24} color="#ff0000" />
      <FaIcon name="star" size={24} color="#ffaa00" />
      <FaIcon name="home" size={24} color="#00ff00" />
      <FaIcon name="user" size={24} color="#0000ff" />
      <FaIcon name="cog" size={24} color="#800080" />
    </View>
  ),
}
