import { useState } from 'react'
import { View } from 'react-native'

import { Continuous } from '@/components/generic/atoms/Continuous'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Atoms/Continuous',
  component: Continuous,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
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
    active: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Continuous>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    color: 'secondary',
    active: true,
  },
}

export const Inactive: Story = {
  args: {
    color: 'secondary',
    active: false,
  },
}

export const DifferentColors: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <Continuous color="primary" active={true} />
      <Continuous color="secondary" active={true} />
      <Continuous color="warning" active={true} />
      <Continuous color="notification" active={true} />
    </View>
  ),
}

export const MultipleIndicators: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <Continuous color="primary" active={true} />
      <Continuous color="secondary" active={true} />
      <Continuous color="warning" active={true} />
    </View>
  ),
}

export const Interactive: Story = {
  render: () => {
    const [active] = useState(true)
    return (
      <View style={{ gap: 20 }}>
        <Continuous color="secondary" active={active} />
        <Continuous color="primary" active={!active} />
      </View>
    )
  },
}
