import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Text, View } from 'react-native'
import { Row } from '@/components/generic/containers/Row'

const meta = {
  title: 'Components/Containers/Row',
  component: Row,
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
      options: ['wrap', 'start', 'end', 'spaced', 'center'],
    },
    gap: {
      control: { type: 'range', min: 0, max: 50, step: 5 },
    },
  },
} satisfies Meta<typeof Row>

export default meta
type Story = StoryObj<typeof meta>

const SampleItem = ({
  text,
  color = '#333',
}: {
  text: string
  color?: string
}) => (
  <View
    style={{
      padding: 10,
      backgroundColor: color,
      borderRadius: 8,
      minHeight: 40,
      justifyContent: 'center',
    }}
  >
    <Text style={{ color: 'white', textAlign: 'center' }}>{text}</Text>
  </View>
)

export const Default: Story = {
  args: {
    children: (
      <>
        <SampleItem text='Item 1' />
        <SampleItem text='Item 2' color='#34C759' />
        <SampleItem text='Item 3' color='#FF9500' />
      </>
    ),
  },
}

export const WithGap: Story = {
  args: {
    gap: 15,
    children: (
      <>
        <SampleItem text='Item 1' />
        <SampleItem text='Item 2' color='#34C759' />
        <SampleItem text='Item 3' color='#FF9500' />
      </>
    ),
  },
}

export const CenterType: Story = {
  args: {
    type: 'center',
    children: (
      <>
        <SampleItem text='Centered Item 1' />
        <SampleItem text='Centered Item 2' color='#34C759' />
        <SampleItem text='Centered Item 3' color='#FF9500' />
      </>
    ),
  },
}

export const StretchType: Story = {
  args: {
    type: 'stretch',
    children: (
      <>
        <SampleItem text='Stretched Item 1' />
        <SampleItem text='Stretched Item 2' color='#34C759' />
        <SampleItem text='Stretched Item 3' color='#FF9500' />
      </>
    ),
  },
}

export const DifferentVariants: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
          Start Variant
        </Text>
        <Row
          variant='start'
          style={{ height: 80, backgroundColor: '#f0f0f0', padding: 10 }}
        >
          <SampleItem text='Item 1' />
          <SampleItem text='Item 2' color='#34C759' />
          <SampleItem text='Item 3' color='#FF9500' />
        </Row>
      </View>

      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
          End Variant
        </Text>
        <Row
          variant='end'
          style={{ height: 80, backgroundColor: '#f0f0f0', padding: 10 }}
        >
          <SampleItem text='Item 1' />
          <SampleItem text='Item 2' color='#34C759' />
          <SampleItem text='Item 3' color='#FF9500' />
        </Row>
      </View>

      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
          Spaced Variant
        </Text>
        <Row
          variant='spaced'
          style={{ height: 80, backgroundColor: '#f0f0f0', padding: 10 }}
        >
          <SampleItem text='Item 1' />
          <SampleItem text='Item 2' color='#34C759' />
          <SampleItem text='Item 3' color='#FF9500' />
        </Row>
      </View>

      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>
          Center Variant
        </Text>
        <Row
          variant='center'
          style={{ height: 80, backgroundColor: '#f0f0f0', padding: 10 }}
        >
          <SampleItem text='Item 1' />
          <SampleItem text='Item 2' color='#34C759' />
          <SampleItem text='Item 3' color='#FF9500' />
        </Row>
      </View>
    </View>
  ),
}

export const WrapVariant: Story = {
  args: {
    variant: 'wrap',
    style: { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8 },
    children: (
      <>
        <SampleItem text='Wrapped Item 1' />
        <SampleItem text='Wrapped Item 2' color='#34C759' />
        <SampleItem text='Wrapped Item 3' color='#FF9500' />
        <SampleItem text='Wrapped Item 4' color='#FF3B30' />
        <SampleItem text='Wrapped Item 5' color='#5856D6' />
        <SampleItem text='Wrapped Item 6' color='#AF52DE' />
      </>
    ),
  },
}

export const ComplexLayout: Story = {
  args: {
    type: 'stretch',
    gap: 10,
    style: { padding: 15, backgroundColor: '#f0f0f0', borderRadius: 8 },
    children: (
      <>
        <SampleItem text='Header' color='#007AFF' />
        <SampleItem text='Content' color='#34C759' />
        <SampleItem text='Footer' color='#FF9500' />
      </>
    ),
  },
}
