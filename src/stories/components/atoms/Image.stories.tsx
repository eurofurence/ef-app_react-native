import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'

import { Image } from '@/components/generic/atoms/Image'

const meta = {
  title: 'Components/Atoms/Image',
  component: Image,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    contentFit: {
      control: { type: 'select' },
      options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
    },
    priority: {
      control: { type: 'select' },
      options: ['low', 'normal', 'high'],
    },
  },
} satisfies Meta<typeof Image>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    source: { uri: 'https://picsum.photos/300/200' },
    style: { width: 300, height: 200 },
  },
}

export const DifferentSizes: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <Image source={{ uri: 'https://picsum.photos/100/100' }} style={{ width: 100, height: 100 }} />
      <Image source={{ uri: 'https://picsum.photos/200/200' }} style={{ width: 200, height: 200 }} />
      <Image source={{ uri: 'https://picsum.photos/300/300' }} style={{ width: 300, height: 300 }} />
    </View>
  ),
}

export const DifferentContentFit: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <Image source={{ uri: 'https://picsum.photos/400/200' }} style={{ width: 200, height: 100 }} contentFit="cover" />
      <Image source={{ uri: 'https://picsum.photos/400/200' }} style={{ width: 200, height: 100 }} contentFit="contain" />
      <Image source={{ uri: 'https://picsum.photos/400/200' }} style={{ width: 200, height: 100 }} contentFit="fill" />
    </View>
  ),
}

export const WithPlaceholder: Story = {
  args: {
    source: { uri: 'https://picsum.photos/300/200' },
    style: { width: 300, height: 200 },
    placeholder: { uri: 'https://picsum.photos/50/50?blur=2' },
  },
}

export const WithPriority: Story = {
  args: {
    source: { uri: 'https://picsum.photos/300/200' },
    style: { width: 300, height: 200 },
    priority: 'high',
  },
}
