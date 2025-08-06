import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { fn } from 'storybook/test'

import { DealerCard } from '@/components/dealers/DealerCard'
import {
  mockDealerDetails,
  mockDealerDetailsWithOffDays,
  mockDealerDetailsLongName,
  mockDealerDetailsSimple,
  mockDealerDetailsNoCategories,
  mockDealerDetailsDifferentCategories,
  createDealerInstance,
} from '@/stories/mocks/dealerData'

const meta = {
  title: 'Components/Dealers/DealerCard',
  component: DealerCard,
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
} satisfies Meta<typeof DealerCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    dealer: createDealerInstance(mockDealerDetails),
    onPress: fn(),
  },
}

export const WithOffDays: Story = {
  args: {
    dealer: createDealerInstance(mockDealerDetailsWithOffDays, false, 'Day 1, Day 2'),
    onPress: fn(),
  },
}

export const LongName: Story = {
  args: {
    dealer: createDealerInstance(mockDealerDetailsLongName),
    onPress: fn(),
  },
}

export const SimpleDealer: Story = {
  args: {
    dealer: createDealerInstance(mockDealerDetailsSimple),
    onPress: fn(),
  },
}

export const NoCategories: Story = {
  args: {
    dealer: createDealerInstance(mockDealerDetailsNoCategories),
    onPress: fn(),
  },
}

export const Interactive: Story = {
  args: {
    dealer: createDealerInstance(mockDealerDetails),
    onPress: fn(),
    onLongPress: fn(),
  },
}

export const DifferentCategories: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      {mockDealerDetailsDifferentCategories.map((details, index) => (
        <DealerCard key={details.Id} dealer={createDealerInstance(details, details.Present, details.OffDays.join(', '))} onPress={fn()} />
      ))}
    </View>
  ),
}

export const MultipleDealers: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <DealerCard dealer={createDealerInstance(mockDealerDetails)} onPress={fn()} />
      <DealerCard dealer={createDealerInstance(mockDealerDetailsWithOffDays, false, 'Day 1, Day 2')} onPress={fn()} />
      <DealerCard dealer={createDealerInstance(mockDealerDetailsLongName)} onPress={fn()} />
      <DealerCard dealer={createDealerInstance(mockDealerDetailsSimple)} onPress={fn()} />
    </View>
  ),
}

export const PresentVsAbsent: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <DealerCard dealer={createDealerInstance(mockDealerDetails, true)} onPress={fn()} />
      <DealerCard dealer={createDealerInstance(mockDealerDetailsWithOffDays, false, 'Day 1, Day 2')} onPress={fn()} />
    </View>
  ),
}

export const FavoriteVsNotFavorite: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <DealerCard dealer={createDealerInstance(mockDealerDetails)} onPress={fn()} />
      <DealerCard dealer={createDealerInstance(mockDealerDetailsSimple)} onPress={fn()} />
    </View>
  ),
}
