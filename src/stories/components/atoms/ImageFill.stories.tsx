import { View } from 'react-native'

import { ImageFill } from '@/components/generic/atoms/ImageFill'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Atoms/ImageFill',
  component: ImageFill,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    target: {
      control: { type: 'object' },
    },
  },
} satisfies Meta<typeof ImageFill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    image: {
      Id: 'image-1',
      InternalReference: 'image-1-ref',
      Width: 800,
      Height: 600,
      SizeInBytes: 50000,
      MimeType: 'image/jpeg',
      ContentHashSha1: 'abc123',
      Url: 'https://picsum.photos/800/600',
      LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
      IsDeleted: 0,
    },
    style: { width: 300, height: 200 },
  },
}

export const WithTarget: Story = {
  args: {
    image: {
      Id: 'image-2',
      InternalReference: 'image-2-ref',
      Width: 800,
      Height: 600,
      SizeInBytes: 50000,
      MimeType: 'image/jpeg',
      ContentHashSha1: 'def456',
      Url: 'https://picsum.photos/800/600',
      LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
      IsDeleted: 0,
    },
    style: { width: 300, height: 200 },
    target: {
      x: 400,
      y: 300,
      size: 200,
    },
  },
}

export const DifferentTargets: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View>
        <ImageFill
          image={{
            Id: 'image-3',
            InternalReference: 'image-3-ref',
            Width: 800,
            Height: 600,
            SizeInBytes: 50000,
            MimeType: 'image/jpeg',
            ContentHashSha1: 'ghi789',
            Url: 'https://picsum.photos/800/600',
            LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
            IsDeleted: 0,
          }}
          style={{ width: 300, height: 200 }}
          target={{
            x: 200,
            y: 150,
            size: 100,
          }}
        />
      </View>
      <View>
        <ImageFill
          image={{
            Id: 'image-4',
            InternalReference: 'image-4-ref',
            Width: 800,
            Height: 600,
            SizeInBytes: 50000,
            MimeType: 'image/jpeg',
            ContentHashSha1: 'jkl012',
            Url: 'https://picsum.photos/800/600',
            LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
            IsDeleted: 0,
          }}
          style={{ width: 300, height: 200 }}
          target={{
            x: 600,
            y: 400,
            size: 150,
          }}
        />
      </View>
    </View>
  ),
}

export const WithoutImage: Story = {
  args: {
    style: { width: 300, height: 200 },
  },
}

export const WithoutTarget: Story = {
  args: {
    image: {
      Id: 'image-5',
      InternalReference: 'image-5-ref',
      Width: 800,
      Height: 600,
      SizeInBytes: 50000,
      MimeType: 'image/jpeg',
      ContentHashSha1: 'mno345',
      Url: 'https://picsum.photos/800/600',
      LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
      IsDeleted: 0,
    },
    style: { width: 300, height: 200 },
  },
}
