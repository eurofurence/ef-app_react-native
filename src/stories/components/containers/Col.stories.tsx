import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View, Text } from 'react-native'

import { Col } from '@/components/generic/containers/Col'

const meta = {
  title: 'Components/Containers/Col',
  component: Col,
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
      options: ['regular', 'start', 'center', 'stretch'],
    },
    variant: {
      control: { type: 'select' },
      options: ['start', 'end', 'spaced'],
    },
    gap: {
      control: { type: 'range', min: 0, max: 50, step: 5 },
    },
  },
} satisfies Meta<typeof Col>

export default meta
type Story = StoryObj<typeof meta>

const SampleItem = ({ text, color = '#333' }: { text: string; color?: string }) => (
  <View style={{ padding: 10, backgroundColor: color, borderRadius: 8, minHeight: 40, justifyContent: 'center' }}>
    <Text style={{ color: 'white', textAlign: 'center' }}>{text}</Text>
  </View>
)

export const Default: Story = {
  args: {
    children: (
      <>
        <SampleItem text="Item 1" />
        <SampleItem text="Item 2" />
        <SampleItem text="Item 3" />
      </>
    ),
  },
}

export const WithGap: Story = {
  args: {
    gap: 15,
    children: (
      <>
        <SampleItem text="Item 1" />
        <SampleItem text="Item 2" />
        <SampleItem text="Item 3" />
      </>
    ),
  },
}

export const CenterType: Story = {
  args: {
    type: 'center',
    children: (
      <>
        <SampleItem text="Centered Item 1" />
        <SampleItem text="Centered Item 2" />
        <SampleItem text="Centered Item 3" />
      </>
    ),
  },
}

export const StretchType: Story = {
  args: {
    type: 'stretch',
    children: (
      <>
        <SampleItem text="Stretched Item 1" />
        <SampleItem text="Stretched Item 2" />
        <SampleItem text="Stretched Item 3" />
      </>
    ),
  },
}

export const DifferentVariants: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Start Variant</Text>
        <Col variant="start" style={{ height: 200, backgroundColor: '#f0f0f0', padding: 10 }}>
          <SampleItem text="Item 1" />
          <SampleItem text="Item 2" />
          <SampleItem text="Item 3" />
        </Col>
      </View>

      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>End Variant</Text>
        <Col variant="end" style={{ height: 200, backgroundColor: '#f0f0f0', padding: 10 }}>
          <SampleItem text="Item 1" />
          <SampleItem text="Item 2" />
          <SampleItem text="Item 3" />
        </Col>
      </View>

      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>Spaced Variant</Text>
        <Col variant="spaced" style={{ height: 200, backgroundColor: '#f0f0f0', padding: 10 }}>
          <SampleItem text="Item 1" />
          <SampleItem text="Item 2" />
          <SampleItem text="Item 3" />
        </Col>
      </View>
    </View>
  ),
}

export const ComplexLayout: Story = {
  args: {
    type: 'stretch',
    gap: 10,
    style: { padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 },
    children: (
      <>
        <SampleItem text="Header Item" color="#007AFF" />
        <SampleItem text="Content Item 1" color="#34C759" />
        <SampleItem text="Content Item 2" color="#FF9500" />
        <SampleItem text="Footer Item" color="#FF3B30" />
      </>
    ),
  },
}
