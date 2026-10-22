import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { fn } from 'storybook/test'
import { EventCard2 } from '@/components/events/EventCard2'
import {
  mockEventDetails,
  mockEventDetailsLongTitle,
  mockEventDetailsPassed,
  mockEventDetailsSimple,
  mockEventDetailsWithBanner,
} from '@/stories/mocks/eventData'

const meta = {
  title: 'Components/Events/EventCard',
  component: EventCard2,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['duration', 'time'],
    },
    onPress: { action: 'pressed' },
    onLongPress: { action: 'long pressed' },
  },
} satisfies Meta<typeof EventCard2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    event: mockEventDetails,
    onPress: fn(),
  },
}

export const WithBanner: Story = {
  args: {
    event: mockEventDetailsWithBanner,
    onPress: fn(),
  },
}

export const PassedEvent: Story = {
  args: {
    event: mockEventDetailsPassed,
    onPress: fn(),
  },
}

export const SimpleEvent: Story = {
  args: {
    event: mockEventDetailsSimple,
    onPress: fn(),
  },
}

export const LongTitle: Story = {
  args: {
    event: mockEventDetailsLongTitle,
    onPress: fn(),
  },
}

export const TimeDisplay: Story = {
  args: {
    event: mockEventDetails,
    type: 'time',
    onPress: fn(),
  },
}

export const DurationDisplay: Story = {
  args: {
    event: mockEventDetails,
    type: 'duration',
    onPress: fn(),
  },
}

export const Interactive: Story = {
  args: {
    event: mockEventDetails,
    onPress: fn(),
    onLongPress: fn(),
  },
}

export const MultipleEvents: Story = {
  args: {
    event: mockEventDetails,
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <EventCard2 event={mockEventDetails} onPress={fn()} />
      <EventCard2 event={mockEventDetailsWithBanner} onPress={fn()} />
      <EventCard2 event={mockEventDetailsPassed} onPress={fn()} />
      <EventCard2 event={mockEventDetailsSimple} onPress={fn()} />
    </View>
  ),
}

export const EventStates: Story = {
  args: {
    event: mockEventDetails,
    onPress: fn(),
  },
  render: () => {
    const now = new Date()
    const upcomingEvent = {
      ...mockEventDetails,
      Start: new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      End: new Date(now.getTime() + 3 * 60 * 60 * 1000),
    }

    const runningEvent = {
      ...mockEventDetails,
      Start: new Date(now.getTime() - 30 * 60 * 1000), // Started 30 minutes ago
      End: new Date(now.getTime() + 30 * 60 * 1000), // Ends in 30 minutes
    }

    const passedEvent = {
      ...mockEventDetails,
      Start: new Date(now.getTime() - 2 * 60 * 60 * 1000), // Started 2 hours ago
      End: new Date(now.getTime() - 1 * 60 * 60 * 1000), // Ended 1 hour ago
    }

    return (
      <View style={{ gap: 15 }}>
        <EventCard2 event={upcomingEvent} onPress={fn()} />
        <EventCard2 event={runningEvent} onPress={fn()} />
        <EventCard2 event={passedEvent} onPress={fn()} />
      </View>
    )
  },
}
