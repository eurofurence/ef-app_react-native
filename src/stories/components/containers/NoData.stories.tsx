import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { NoData } from '@/components/generic/containers/NoData'

const meta = {
  title: 'Components/Containers/NoData',
  component: NoData,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    text: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof NoData>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    text: 'No data available',
  },
}

export const CustomMessage: Story = {
  args: {
    text: 'No events found for this date',
  },
}

export const LongMessage: Story = {
  args: {
    text: 'No data available at this time. Please check back later or try refreshing the page.',
  },
}

export const WithReactNode: Story = {
  args: {
    text: (
      <>
        No data available
        {'\n'}
        Please try again later
      </>
    ),
  },
}

export const DifferentMessages: Story = {
  args: {
    text: 'Sample message',
  },
  render: () => (
    <View style={{ gap: 20 }}>
      <NoData text="No events found" />
      <NoData text="No messages available" />
      <NoData text="No results to display" />
      <NoData text="Empty state" />
    </View>
  ),
}

export const ComplexMessage: Story = {
  args: {
    text: (
      <>
        No items found
        {'\n\n'}
        Try adjusting your search criteria or check back later for new content.
      </>
    ),
  },
}
