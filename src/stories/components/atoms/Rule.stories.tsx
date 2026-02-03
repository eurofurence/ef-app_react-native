import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { Rule } from '@/components/generic/atoms/Rule'

const meta = {
  title: 'Components/Atoms/Rule',
  component: Rule,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Rule>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Rule />,
}

export const WithContent: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View
        style={{ padding: 10, backgroundColor: '#ffffff', borderRadius: 8 }}
      >
        <Rule />
      </View>
      <View
        style={{ padding: 10, backgroundColor: '#ffffff', borderRadius: 8 }}
      >
        <Rule />
      </View>
    </View>
  ),
}

export const MultipleRules: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <Rule />
      <Rule />
      <Rule />
    </View>
  ),
}

export const InContext: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View
        style={{ padding: 15, backgroundColor: '#ffffff', borderRadius: 8 }}
      >
        <View style={{ padding: 10 }}>
          <Rule />
        </View>
      </View>
      <View
        style={{ padding: 15, backgroundColor: '#e0e0e0', borderRadius: 8 }}
      >
        <View style={{ padding: 10 }}>
          <Rule />
        </View>
      </View>
    </View>
  ),
}
