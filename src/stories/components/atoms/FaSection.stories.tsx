import { View } from 'react-native'

import { FaSection } from '@/components/generic/atoms/FaSection'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Atoms/FaSection',
  component: FaSection,
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
      options: ['home', 'user', 'heart', 'star', 'cog', 'search', 'plus', 'minus', 'check', 'times'],
    },
    title: {
      control: { type: 'text' },
    },
    subtitle: {
      control: { type: 'text' },
    },
    backgroundColor: {
      control: { type: 'select' },
      options: ['background', 'darken', 'inverted', 'secondary', 'notification'],
    },
    titleColor: {
      control: { type: 'select' },
      options: ['text', 'important', 'secondary', 'notification'],
    },
    subtitleColor: {
      control: { type: 'select' },
      options: ['text', 'important', 'secondary', 'notification'],
    },
  },
} satisfies Meta<typeof FaSection>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'home',
    title: 'Welcome Home',
    subtitle: 'This is a subtitle',
  },
}

export const WithoutIcon: Story = {
  args: {
    title: 'No Icon Section',
    subtitle: 'This section has no icon',
  },
}

export const WithoutSubtitle: Story = {
  args: {
    icon: 'star',
    title: 'Star Section',
  },
}

export const DifferentColors: Story = {
  args: {
    icon: 'heart',
    title: 'Red Heart Section',
    subtitle: 'With custom colors',
  },
  render: () => (
    <View style={{ gap: 20 }}>
      <FaSection icon="heart" title="Red Heart Section" subtitle="With custom colors" backgroundColor="notification" titleColor="important" subtitleColor="text" />
      <FaSection icon="star" title="Blue Star Section" subtitle="Another color combination" backgroundColor="secondary" titleColor="text" subtitleColor="important" />
    </View>
  ),
}

export const LongText: Story = {
  args: {
    icon: 'user',
    title: 'This is a very long title that should demonstrate how the component handles text overflow and wrapping in different scenarios',
    subtitle:
      'This is also a very long subtitle that should demonstrate how the component handles text overflow and wrapping in different scenarios with even more text to make it really long',
  },
}
