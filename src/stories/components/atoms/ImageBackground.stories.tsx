import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Text, View } from 'react-native'
import { ImageBackground } from '@/components/generic/atoms/ImageBackground'

const meta = {
  title: 'Components/Atoms/ImageBackground',
  component: ImageBackground,
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
} satisfies Meta<typeof ImageBackground>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    source: { uri: 'https://picsum.photos/400/300' },
    style: { width: 400, height: 300 },
    children: (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text
          style={{
            color: 'white',
            fontSize: 24,
            fontWeight: 'bold',
            textShadowColor: 'black',
            textShadowRadius: 2,
          }}
        >
          Content Overlay
        </Text>
      </View>
    ),
  },
}

export const DifferentContentFit: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <ImageBackground
        source={{ uri: 'https://picsum.photos/400/200' }}
        style={{ width: 200, height: 100 }}
        contentFit='cover'
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              textShadowColor: 'black',
              textShadowRadius: 2,
            }}
          >
            Cover
          </Text>
        </View>
      </ImageBackground>
      <ImageBackground
        source={{ uri: 'https://picsum.photos/400/200' }}
        style={{ width: 200, height: 100 }}
        contentFit='contain'
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              textShadowColor: 'black',
              textShadowRadius: 2,
            }}
          >
            Contain
          </Text>
        </View>
      </ImageBackground>
      <ImageBackground
        source={{ uri: 'https://picsum.photos/400/200' }}
        style={{ width: 200, height: 100 }}
        contentFit='fill'
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: 'bold',
              textShadowColor: 'black',
              textShadowRadius: 2,
            }}
          >
            Fill
          </Text>
        </View>
      </ImageBackground>
    </View>
  ),
}

export const WithComplexContent: Story = {
  args: {
    source: { uri: 'https://picsum.photos/400/300' },
    style: { width: 400, height: 300 },
    children: (
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Text
            style={{
              color: 'white',
              fontSize: 28,
              fontWeight: 'bold',
              textShadowColor: 'black',
              textShadowRadius: 3,
            }}
          >
            Header
          </Text>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              padding: 15,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: 'white', fontSize: 16 }}>
              This is some content with a semi-transparent background
            </Text>
          </View>
        </View>
      </View>
    ),
  },
}

export const DifferentSizes: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <ImageBackground
        source={{ uri: 'https://picsum.photos/200/200' }}
        style={{ width: 200, height: 200 }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              textShadowColor: 'black',
              textShadowRadius: 2,
            }}
          >
            Square
          </Text>
        </View>
      </ImageBackground>
      <ImageBackground
        source={{ uri: 'https://picsum.photos/400/200' }}
        style={{ width: 400, height: 200 }}
      >
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              textShadowColor: 'black',
              textShadowRadius: 2,
            }}
          >
            Wide
          </Text>
        </View>
      </ImageBackground>
    </View>
  ),
}
