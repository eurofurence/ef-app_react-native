import { View } from 'react-native'

import { Badge } from '@/components/generic/containers/Badge'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Containers/Badge',
  component: Badge,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    unpad: {
      control: { type: 'range', min: 0, max: 20, step: 1 },
    },
    badgeColor: {
      control: { type: 'select' },
      options: ['background', 'darken', 'inverted', 'secondary', 'notification', 'transparent'],
    },
    textColor: {
      control: { type: 'select' },
      options: ['text', 'important', 'secondary', 'notification'],
    },
    textType: {
      control: { type: 'select' },
      options: [
        'lead',
        'xl',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'caption',
        'compact',
        'regular',
        'minor',
        'cap',
        'bold',
        'extraBold',
        'lineThrough',
        'italic',
        'underlined',
        'para',
      ],
    },
    textVariant: {
      control: { type: 'select' },
      options: ['regular', 'narrow', 'bold', 'lineThrough', 'underlined', 'middle', 'shadow', 'receded'],
    },
    icon: {
      control: { type: 'select' },
      options: ['home', 'star', 'cog', 'plus', 'minus', 'check'],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    unpad: 10,
    textColor: 'important',
    children: 'Badge Text',
  },
}

export const WithIcon: Story = {
  args: {
    unpad: 10,
    textColor: 'important',
    icon: 'star',
    children: 'Badge with Icon',
  },
}

export const DifferentColors: Story = {
  args: {
    unpad: 10,
    textColor: 'important',
    children: 'Sample Badge',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Badge unpad={10} badgeColor="secondary" textColor="important" children="Secondary Badge" />
      <Badge unpad={10} badgeColor="notification" textColor="important" children="Notification Badge" />
      <Badge unpad={10} badgeColor="inverted" textColor="invImportant" children="Inverted Badge" />
    </View>
  ),
}

export const DifferentPadding: Story = {
  args: {
    unpad: 10,
    textColor: 'important',
    children: 'Sample Badge',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Badge unpad={5} textColor="important" children="Small Padding" />
      <Badge unpad={10} textColor="important" children="Medium Padding" />
      <Badge unpad={15} textColor="important" children="Large Padding" />
    </View>
  ),
}

export const DifferentTextTypes: Story = {
  args: {
    unpad: 10,
    textColor: 'important',
    children: 'Sample Badge',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Badge unpad={10} textColor="important" textType="h1" children="H1 Text" />
      <Badge unpad={10} textColor="important" textType="h3" children="H3 Text" />
      <Badge unpad={10} textColor="important" textType="caption" children="Caption Text" />
      <Badge unpad={10} textColor="important" textType="compact" children="Compact Text" />
    </View>
  ),
}

export const WithIcons: Story = {
  args: {
    unpad: 10,
    textColor: 'important',
    children: 'Sample Badge',
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <Badge unpad={10} textColor="important" icon="home" children="Home Badge" />
      <Badge unpad={10} textColor="important" icon="star" children="Star Badge" />
      <Badge unpad={10} textColor="important" icon="cog" children="Settings Badge" />
      <Badge unpad={10} textColor="important" icon="plus" children="Add Badge" />
    </View>
  ),
}
