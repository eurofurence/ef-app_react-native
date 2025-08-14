import { View } from 'react-native'
import { fn } from 'storybook/test'

import { EventCard, eventInstanceForAny, eventInstanceForPassed } from '@/components/events/EventCard'
import { mockEventDetails, mockEventDetailsWithBanner, mockEventDetailsPassed, mockEventDetailsSimple, mockEventDetailsLongTitle } from '@/stories/mocks/eventData'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Events/EventCard',
  component: EventCard,
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
} satisfies Meta<typeof EventCard>

export default meta
type Story = StoryObj<typeof meta>

// Helper function to create event instances
const createEventInstance = (details: any, now: Date = new Date()) => {
  return eventInstanceForAny(details, now)
}

export const Default: Story = {
  args: {
    event: createEventInstance(mockEventDetails),
    onPress: fn(),
  },
}

export const WithBanner: Story = {
  args: {
    event: createEventInstance(mockEventDetailsWithBanner),
    onPress: fn(),
  },
}

export const PassedEvent: Story = {
  args: {
    event: eventInstanceForPassed(mockEventDetailsPassed),
    onPress: fn(),
  },
}

export const SimpleEvent: Story = {
  args: {
    event: createEventInstance(mockEventDetailsSimple),
    onPress: fn(),
  },
}

export const LongTitle: Story = {
  args: {
    event: createEventInstance(mockEventDetailsLongTitle),
    onPress: fn(),
  },
}

export const TimeDisplay: Story = {
  args: {
    event: createEventInstance(mockEventDetails),
    type: 'time',
    onPress: fn(),
  },
}

export const DurationDisplay: Story = {
  args: {
    event: createEventInstance(mockEventDetails),
    type: 'duration',
    onPress: fn(),
  },
}

export const Interactive: Story = {
  args: {
    event: createEventInstance(mockEventDetails),
    onPress: fn(),
    onLongPress: fn(),
  },
}

export const MultipleEvents: Story = {
  args: {
    event: createEventInstance(mockEventDetails),
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <EventCard event={createEventInstance(mockEventDetails)} onPress={fn()} />
      <EventCard event={createEventInstance(mockEventDetailsWithBanner)} onPress={fn()} />
      <EventCard event={eventInstanceForPassed(mockEventDetailsPassed)} onPress={fn()} />
      <EventCard event={createEventInstance(mockEventDetailsSimple)} onPress={fn()} />
    </View>
  ),
}

export const EventStates: Story = {
  args: {
    event: createEventInstance(mockEventDetails),
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
        <EventCard event={createEventInstance(upcomingEvent, now)} onPress={fn()} />
        <EventCard event={createEventInstance(runningEvent, now)} onPress={fn()} />
        <EventCard event={eventInstanceForPassed(passedEvent)} onPress={fn()} />
      </View>
    )
  },
}
