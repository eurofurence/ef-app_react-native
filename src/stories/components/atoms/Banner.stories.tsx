import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Banner } from '@/components/generic/atoms/Banner'

const meta = {
  title: 'Components/Atoms/Banner',
  component: Banner,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    viewable: {
      control: { type: 'boolean' },
    },
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    image: {
      Id: 'banner-1',
      InternalReference: 'banner-1-ref',
      Width: 800,
      Height: 200,
      SizeInBytes: 50000,
      MimeType: 'image/jpeg',
      ContentHashSha1: 'abc123',
      Url: 'https://picsum.photos/800/200',
      LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
      IsDeleted: 0,
    },
    title: 'Event Banner',
    viewable: true,
  },
}

export const WithoutImage: Story = {
  args: {
    image: undefined,
    title: 'No Banner',
    viewable: false,
  },
}

export const NonViewable: Story = {
  args: {
    image: {
      Id: 'banner-2',
      InternalReference: 'banner-2-ref',
      Width: 800,
      Height: 200,
      SizeInBytes: 50000,
      MimeType: 'image/jpeg',
      ContentHashSha1: 'def456',
      Url: 'https://picsum.photos/800/200?random=2',
      LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
      IsDeleted: 0,
    },
    title: 'Non-viewable Banner',
    viewable: false,
  },
}

export const DifferentAspectRatios: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <Banner
        image={{
          Id: 'banner-wide',
          InternalReference: 'banner-wide-ref',
          Width: 1200,
          Height: 200,
          SizeInBytes: 60000,
          MimeType: 'image/jpeg',
          ContentHashSha1: 'ghi789',
          Url: 'https://picsum.photos/1200/200',
          LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
          IsDeleted: 0,
        }}
        title="Wide Banner"
        viewable={true}
      />
      <Banner
        image={{
          Id: 'banner-square',
          InternalReference: 'banner-square-ref',
          Width: 400,
          Height: 400,
          SizeInBytes: 80000,
          MimeType: 'image/jpeg',
          ContentHashSha1: 'jkl012',
          Url: 'https://picsum.photos/400/400',
          LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
          IsDeleted: 0,
        }}
        title="Square Banner"
        viewable={true}
      />
      <Banner
        image={{
          Id: 'banner-tall',
          InternalReference: 'banner-tall-ref',
          Width: 300,
          Height: 600,
          SizeInBytes: 70000,
          MimeType: 'image/jpeg',
          ContentHashSha1: 'mno345',
          Url: 'https://picsum.photos/300/600',
          LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
          IsDeleted: 0,
        }}
        title="Tall Banner"
        viewable={true}
      />
    </View>
  ),
}

export const Interactive: Story = {
  args: {
    image: {
      Id: 'banner-interactive',
      InternalReference: 'banner-interactive-ref',
      Width: 800,
      Height: 200,
      SizeInBytes: 50000,
      MimeType: 'image/jpeg',
      ContentHashSha1: 'pqr678',
      Url: 'https://picsum.photos/800/200?random=3',
      LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
      IsDeleted: 0,
    },
    title: 'Clickable Banner',
    viewable: true,
  },
}
