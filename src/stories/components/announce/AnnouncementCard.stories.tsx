import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { fn } from 'storybook/test'
import { AnnouncementCard } from '@/components/announce/AnnouncementCard'
import {
  createAnnouncementInstance,
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
    announcement: createAnnouncementInstance(mockAnnouncementDetails),
    onPress: fn(),
  },
}

export const WithImage: Story = {
  args: {
    announcement: createAnnouncementInstance(mockAnnouncementDetailsWithImage),
    onPress: fn(),
  },
}

export const LongTitle: Story = {
  args: {
    announcement: createAnnouncementInstance(mockAnnouncementDetailsLongTitle),
    onPress: fn(),
  },
}

export const Interactive: Story = {
  args: {
    announcement: createAnnouncementInstance(mockAnnouncementDetails),
    onPress: fn(),
    onLongPress: fn(),
  },
}

export const DifferentTimes: Story = {
  args: {
    announcement: createAnnouncementInstance(mockAnnouncementDetails),
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <AnnouncementCard
        announcement={createAnnouncementInstance(
          mockAnnouncementDetails,
          'Just now'
        )}
        onPress={fn()}
      />
      <AnnouncementCard
        announcement={createAnnouncementInstance(
          mockAnnouncementDetailsWithImage,
          '5 minutes ago'
        )}
        onPress={fn()}
      />
      <AnnouncementCard
        announcement={createAnnouncementInstance(
          mockAnnouncementDetailsLongTitle,
          '1 hour ago'
        )}
        onPress={fn()}
      />
      <AnnouncementCard
        announcement={createAnnouncementInstance(
          mockAnnouncementDetails,
          '2 hours ago'
        )}
        onPress={fn()}
      />
    </View>
  ),
}

export const DifferentAreas: Story = {
  args: {
    announcement: createAnnouncementInstance(mockAnnouncementDetails),
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      {mockAnnouncementDetailsDifferentAreas.map((details, index) => (
        <AnnouncementCard
          key={details.Id}
          announcement={createAnnouncementInstance(
            details,
            `${index + 1} hour${index > 0 ? 's' : ''} ago`
          )}
          onPress={fn()}
        />
      ))}
    </View>
  ),
}

export const MultipleAnnouncements: Story = {
  args: {
    announcement: createAnnouncementInstance(mockAnnouncementDetails),
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <AnnouncementCard
        announcement={createAnnouncementInstance(mockAnnouncementDetails)}
        onPress={fn()}
      />
      <AnnouncementCard
        announcement={createAnnouncementInstance(
          mockAnnouncementDetailsWithImage
        )}
        onPress={fn()}
      />
      <AnnouncementCard
        announcement={createAnnouncementInstance(
          mockAnnouncementDetailsLongTitle
        )}
        onPress={fn()}
      />
    </View>
  ),
}
