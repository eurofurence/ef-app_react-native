import { View, Text } from 'react-native'
import { fn } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const TestComponent = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <View style={{ padding: 20, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
    <Text style={{ marginTop: 8 }}>This is a test component to verify Storybook setup.</Text>
  </View>
)

const meta = {
  title: 'Test/Simple',
  component: TestComponent,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    onPress: {
      action: 'pressed',
    },
  },
} satisfies Meta<typeof TestComponent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Test Component',
    onPress: fn(),
  },
}

export const CustomTitle: Story = {
  args: {
    title: 'Custom Title',
    onPress: fn(),
  },
}
