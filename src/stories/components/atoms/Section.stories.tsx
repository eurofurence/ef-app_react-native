import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { fn } from 'storybook/test'

import { Section } from '@/components/generic/atoms/Section'

const meta = {
  title: 'Components/Atoms/Section',
  component: Section,
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
      options: ['heart', 'star', 'home', 'account', 'cog', 'bell', 'calendar', 'map-marker', 'share', 'download', 'search', 'menu', 'close', 'check', 'plus', 'minus'],
    },
    titleColor: {
      control: { type: 'select' },
      options: ['text', 'important', 'invImportant', 'white', 'lighten'],
    },
    subtitleColor: {
      control: { type: 'select' },
      options: ['text', 'important', 'invImportant', 'white', 'lighten'],
    },
    titleVariant: {
      control: { type: 'select' },
      options: ['regular', 'narrow', 'bold', 'lineThrough', 'underlined', 'middle', 'shadow', 'receded'],
    },
    subtitleVariant: {
      control: { type: 'select' },
      options: ['regular', 'narrow', 'bold', 'lineThrough', 'underlined', 'middle', 'shadow', 'receded'],
    },
  },
} satisfies Meta<typeof Section>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: 'calendar',
    title: 'Event Schedule',
    subtitle: 'View all upcoming events',
  },
}

export const WithoutIcon: Story = {
  args: {
    title: 'Section Title',
    subtitle: 'Section subtitle',
  },
}

export const WithoutSubtitle: Story = {
  args: {
    icon: 'star',
    title: 'Featured Events',
  },
}

export const DifferentIcons: Story = {
  args: {
    icon: 'calendar',
    title: 'Events',
    subtitle: 'Browse all events',
  },
  render: () => (
    <View style={{ gap: 20 }}>
      <Section icon="calendar" title="Events" subtitle="Browse all events" />
      <Section icon="map-marker" title="Venue" subtitle="Convention center" />
      <Section icon="account" title="Profile" subtitle="User settings" />
      <Section icon="cog" title="Settings" subtitle="App configuration" />
    </View>
  ),
}

export const CustomColors: Story = {
  args: {
    icon: 'heart',
    title: 'Favorites',
    subtitle: 'Your saved items',
    titleColor: 'important',
    subtitleColor: 'text',
  },
  render: () => (
    <View style={{ gap: 20 }}>
      <Section icon="heart" title="Favorites" subtitle="Your saved items" titleColor="important" subtitleColor="text" />
      <Section icon="star" title="Featured" subtitle="Highlighted content" titleColor="invImportant" subtitleColor="lighten" />
    </View>
  ),
}

export const CustomVariants: Story = {
  args: {
    icon: 'bell',
    title: 'Notifications',
    subtitle: 'Stay updated',
    titleVariant: 'bold',
    subtitleVariant: 'receded',
  },
  render: () => (
    <View style={{ gap: 20 }}>
      <Section icon="bell" title="Notifications" subtitle="Stay updated" titleVariant="bold" subtitleVariant="receded" />
      <Section icon="share" title="Share" subtitle="Spread the word" titleVariant="lineThrough" subtitleVariant="underlined" />
    </View>
  ),
}

export const Interactive: Story = {
  args: {
    icon: 'heart',
    title: 'Interactive Section',
    subtitle: 'Click to interact',
  },
}
