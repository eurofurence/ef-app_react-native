import { View, Text } from 'react-native'

import { Floater } from '@/components/generic/containers/Floater'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Containers/Floater',
  component: Floater,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Floater>

export default meta
type Story = StoryObj<typeof meta>

const SampleContent = ({ title, color = '#007AFF' }: { title: string; color?: string }) => (
  <View style={{ padding: 20, backgroundColor: color, borderRadius: 12, marginBottom: 10 }}>
    <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>{title}</Text>
    <Text style={{ color: 'white', fontSize: 14, textAlign: 'center', marginTop: 8 }}>This is sample content inside the floater component.</Text>
  </View>
)

export const Default: Story = {
  args: {
    children: <SampleContent title="Default Floater" />,
  },
}

export const MultipleItems: Story = {
  args: {
    children: (
      <>
        <SampleContent title="First Item" color="#34C759" />
        <SampleContent title="Second Item" color="#FF9500" />
        <SampleContent title="Third Item" color="#FF3B30" />
      </>
    ),
  },
}

export const WithCustomStyles: Story = {
  args: {
    containerStyle: { backgroundColor: '#f0f0f0', borderRadius: 8 },
    contentStyle: { padding: 10 },
    children: (
      <>
        <SampleContent title="Custom Container" color="#5856D6" />
        <SampleContent title="Custom Content" color="#AF52DE" />
      </>
    ),
  },
}

export const LongContent: Story = {
  args: {
    children: (
      <View style={{ padding: 20, backgroundColor: '#007AFF', borderRadius: 12 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Long Content</Text>
        <Text style={{ color: 'white', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
          This is a longer piece of content that demonstrates how the Floater component handles text that might wrap to multiple lines. The content should be properly contained
          within the floater's maximum width constraints.
        </Text>
        <Text style={{ color: 'white', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
          Additional paragraphs can be added here to show how the component handles multiple text blocks and maintains proper spacing.
        </Text>
      </View>
    ),
  },
}

export const ComplexLayout: Story = {
  args: {
    children: (
      <View style={{ gap: 15 }}>
        <View style={{ padding: 15, backgroundColor: '#34C759', borderRadius: 8 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Header Section</Text>
          <Text style={{ color: 'white', fontSize: 14, marginTop: 5 }}>This is the header content.</Text>
        </View>

        <View style={{ padding: 15, backgroundColor: '#FF9500', borderRadius: 8 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Main Content</Text>
          <Text style={{ color: 'white', fontSize: 14, marginTop: 5 }}>This section contains the main content with multiple elements.</Text>
        </View>

        <View style={{ padding: 15, backgroundColor: '#FF3B30', borderRadius: 8 }}>
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>Footer Section</Text>
          <Text style={{ color: 'white', fontSize: 14, marginTop: 5 }}>This is the footer content.</Text>
        </View>
      </View>
    ),
  },
}
