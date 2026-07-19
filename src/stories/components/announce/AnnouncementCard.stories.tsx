import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { subHours, subMinutes, subSeconds } from 'date-fns'
import { View } from 'react-native'
import { fn } from 'storybook/test'
import { AnnouncementCard } from '@/components/announce/AnnouncementCard'
import {
  mockAnnouncementDetails,
  mockAnnouncementDetailsDifferentAreas,
  mockAnnouncementDetailsLongTitle,
  mockAnnouncementDetailsWithImage,
} from '@/stories/mocks/announcementData'

const meta = {
  title: 'Components/Announce/AnnouncementCard',
  component: AnnouncementCard,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    onPress: { action: 'pressed' },
    onLongPress: { action: 'long pressed' },
  },
} satisfies Meta<typeof AnnouncementCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    announcement: mockAnnouncementDetails,
    onPress: fn(),
  },
}

export const WithImage: Story = {
  args: {
    announcement: mockAnnouncementDetailsWithImage,
    onPress: fn(),
  },
}

export const LongTitle: Story = {
  args: {
    announcement: mockAnnouncementDetailsLongTitle,
    onPress: fn(),
  },
}

export const Interactive: Story = {
  args: {
    announcement: mockAnnouncementDetails,
    onPress: fn(),
    onLongPress: fn(),
  },
}

export const DifferentTimes: Story = {
  args: {
    announcement: mockAnnouncementDetails,
    onPress: fn(),
  },
  render: () => {
    const now = new Date()
    return (
      <View style={{ gap: 15 }}>
        <AnnouncementCard
          announcement={{
            ...mockAnnouncementDetails,
            ValidFromDateTimeUtc: subSeconds(now, 5).toISOString(),
          }}
          onPress={fn()}
        />
        <AnnouncementCard
          announcement={{
            ...mockAnnouncementDetailsWithImage,
            ValidFromDateTimeUtc: subMinutes(now, 5).toISOString(),
          }}
          onPress={fn()}
        />
        <AnnouncementCard
          announcement={{
            ...mockAnnouncementDetailsLongTitle,
            ValidFromDateTimeUtc: subHours(now, 1).toISOString(),
          }}
          onPress={fn()}
        />
        <AnnouncementCard
          announcement={{
            ...mockAnnouncementDetails,
            ValidFromDateTimeUtc: subHours(now, 2).toISOString(),
          }}
          onPress={fn()}
        />
      </View>
    )
  },
}

export const DifferentAreas: Story = {
  args: {
    announcement: mockAnnouncementDetails,
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      {mockAnnouncementDetailsDifferentAreas.map((details) => (
        <AnnouncementCard
          key={details.Id}
          announcement={details}
          onPress={fn()}
        />
      ))}
    </View>
  ),
}

export const MultipleAnnouncements: Story = {
  args: {
    announcement: mockAnnouncementDetails,
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <AnnouncementCard announcement={mockAnnouncementDetails} onPress={fn()} />
      <AnnouncementCard
        announcement={mockAnnouncementDetailsWithImage}
        onPress={fn()}
      />
      <AnnouncementCard
        announcement={mockAnnouncementDetailsLongTitle}
        onPress={fn()}
      />
    </View>
  ),
}
