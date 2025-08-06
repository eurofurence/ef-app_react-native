import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Marker } from '@/components/generic/atoms/Marker'

const meta = {
  title: 'Components/Atoms/Marker',
  component: Marker,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    markerType: {
      control: { type: 'select' },
      options: ['map-marker', 'heart', 'star', 'home', 'account', 'cog', 'bell', 'calendar', 'share', 'download', 'search', 'menu', 'close', 'check', 'plus', 'minus'],
    },
    markerColor: {
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
    markerSize: {
      control: { type: 'range', min: 16, max: 64, step: 4 },
    },
  },
} satisfies Meta<typeof Marker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    markerType: 'map-marker',
    markerColor: 'marker',
    markerSize: 40,
  },
}

export const DifferentTypes: Story = {
  args: {
    markerType: 'map-marker',
    markerColor: 'marker',
    markerSize: 40,
  },
  render: () => (
    <View style={{ gap: 20 }}>
      <Marker markerType="map-marker" markerColor="marker" markerSize={40} />
      <Marker markerType="heart" markerColor="marker" markerSize={40} />
      <Marker markerType="star" markerColor="marker" markerSize={40} />
      <Marker markerType="home" markerColor="marker" markerSize={40} />
    </View>
  ),
}

export const DifferentSizes: Story = {
  args: {
    markerType: 'map-marker',
    markerColor: 'marker',
    markerSize: 40,
  },
  render: () => (
    <View style={{ gap: 20 }}>
      <Marker markerType="map-marker" markerColor="marker" markerSize={24} />
      <Marker markerType="map-marker" markerColor="marker" markerSize={32} />
      <Marker markerType="map-marker" markerColor="marker" markerSize={40} />
      <Marker markerType="map-marker" markerColor="marker" markerSize={48} />
    </View>
  ),
}

export const DifferentColors: Story = {
  args: {
    markerType: 'map-marker',
    markerColor: 'marker',
    markerSize: 40,
  },
  render: () => (
    <View style={{ gap: 20 }}>
      <Marker markerType="map-marker" markerColor="primary" markerSize={40} />
      <Marker markerType="map-marker" markerColor="secondary" markerSize={40} />
      <Marker markerType="map-marker" markerColor="warning" markerSize={40} />
      <Marker markerType="map-marker" markerColor="notification" markerSize={40} />
    </View>
  ),
}

export const Interactive: Story = {
  args: {
    markerType: 'map-marker',
    markerColor: 'marker',
    markerSize: 40,
  },
}
