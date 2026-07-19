import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { fn } from 'storybook/test'
import { DealerCard2 } from '@/components/dealers/DealerCard2'
import {
  mockDealerDetails,
  mockDealerDetailsDifferentCategories,
  mockDealerDetailsLongName,
  mockDealerDetailsNoCategories,
  mockDealerDetailsSimple,
  mockDealerDetailsWithOffDays,
} from '@/stories/mocks/dealerData'

const meta = {
  title: 'Components/Dealers/DealerCard',
  component: DealerCard2,
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
} satisfies Meta<typeof DealerCard2>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    dealer: mockDealerDetails,
    onPress: fn(),
  },
}

export const WithOffDays: Story = {
  args: {
    dealer: mockDealerDetailsWithOffDays,
    onPress: fn(),
  },
}

export const LongName: Story = {
  args: {
    dealer: mockDealerDetailsLongName,
    onPress: fn(),
  },
}

export const SimpleDealer: Story = {
  args: {
    dealer: mockDealerDetailsSimple,
    onPress: fn(),
  },
}

export const NoCategories: Story = {
  args: {
    dealer: mockDealerDetailsNoCategories,
    onPress: fn(),
  },
}

export const Interactive: Story = {
  args: {
    dealer: mockDealerDetails,
    onPress: fn(),
    onLongPress: fn(),
  },
}

export const DifferentCategories: Story = {
  args: {
    dealer: mockDealerDetails,
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      {mockDealerDetailsDifferentCategories.map((details) => (
        <DealerCard2 key={details.Id} dealer={details} onPress={fn()} />
      ))}
    </View>
  ),
}

export const MultipleDealers: Story = {
  args: {
    dealer: mockDealerDetails,
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <DealerCard2 dealer={mockDealerDetails} onPress={fn()} />
      <DealerCard2 dealer={mockDealerDetailsWithOffDays} onPress={fn()} />
      <DealerCard2 dealer={mockDealerDetailsLongName} onPress={fn()} />
      <DealerCard2 dealer={mockDealerDetailsSimple} onPress={fn()} />
    </View>
  ),
}

export const PresentVsAbsent: Story = {
  args: {
    dealer: mockDealerDetails,
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <DealerCard2 dealer={mockDealerDetails} onPress={fn()} />
      <DealerCard2 dealer={mockDealerDetailsWithOffDays} onPress={fn()} />
    </View>
  ),
}

export const FavoriteVsNotFavorite: Story = {
  args: {
    dealer: mockDealerDetails,
    onPress: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <DealerCard2 dealer={mockDealerDetails} onPress={fn()} />
      <DealerCard2 dealer={mockDealerDetailsSimple} onPress={fn()} />
    </View>
  ),
}
