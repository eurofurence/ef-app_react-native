import { useState } from 'react'
import { View } from 'react-native'

import { Progress } from '@/components/generic/atoms/Progress'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Atoms/Progress',
  component: Progress,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
    },
    color: {
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'background',
        'surface',
        'inverted',
        'text',
        'important',
        'invText',
        'invImportant',
        'warning',
        'notification',
        'darken',
        'lighten',
        'soften',
        'white',
        'superSponsor',
        'sponsor',
        'superSponsorText',
        'sponsorText',
        'marker',
      ],
    },
  },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    value: 0.5,
    color: 'secondary',
  },
}

export const Empty: Story = {
  args: {
    value: 0,
    color: 'secondary',
  },
}

export const Full: Story = {
  args: {
    value: 1,
    color: 'secondary',
  },
}

export const DifferentValues: Story = {
  args: {
    value: 0.5,
    color: 'secondary',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Progress value={0.1} color="secondary" />
      <Progress value={0.3} color="secondary" />
      <Progress value={0.5} color="secondary" />
      <Progress value={0.7} color="secondary" />
      <Progress value={0.9} color="secondary" />
    </View>
  ),
}

export const DifferentColors: Story = {
  args: {
    value: 0.6,
    color: 'secondary',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Progress value={0.6} color="primary" />
      <Progress value={0.6} color="secondary" />
      <Progress value={0.6} color="warning" />
      <Progress value={0.6} color="notification" />
    </View>
  ),
}

export const Interactive: Story = {
  args: {
    value: 0.3,
    color: 'secondary',
  },
  render: () => {
    const [value] = useState(0.3)
    return (
      <View style={{ gap: 20 }}>
        <Progress value={value} color="secondary" />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Progress value={0.2} color="primary" />
          <Progress value={0.4} color="secondary" />
          <Progress value={0.6} color="warning" />
          <Progress value={0.8} color="notification" />
        </View>
      </View>
    )
  },
}
