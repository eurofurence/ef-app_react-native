import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { fn } from 'storybook/test'

import { Card } from '@/components/generic/containers/Card'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'

const meta = {
  title: 'Components/Containers/Card',
  component: Card,
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
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card>
      <Label type="h3">Card Title</Label>
      <Label type="regular" style={{ marginTop: 8 }}>
        This is a basic card with some content. It can contain any React components.
      </Label>
    </Card>
  ),
}

export const WithPress: Story = {
  render: () => (
    <Card onPress={fn()}>
      <Label type="h3">Clickable Card</Label>
      <Label type="regular" style={{ marginTop: 8 }}>
        This card is clickable. Tap it to trigger the onPress event.
      </Label>
    </Card>
  ),
}

export const WithLongPress: Story = {
  render: () => (
    <Card onLongPress={fn()}>
      <Label type="h3">Long Press Card</Label>
      <Label type="regular" style={{ marginTop: 8 }}>
        This card supports long press. Hold it to trigger the onLongPress event.
      </Label>
    </Card>
  ),
}

export const WithBothPress: Story = {
  render: () => (
    <Card onPress={fn()} onLongPress={fn()}>
      <Label type="h3">Interactive Card</Label>
      <Label type="regular" style={{ marginTop: 8 }}>
        This card supports both tap and long press interactions.
      </Label>
    </Card>
  ),
}

export const ComplexContent: Story = {
  render: () => (
    <Card onPress={fn()}>
      <Label type="h3">Complex Card</Label>
      <Label type="regular" style={{ marginTop: 8 }}>
        This card contains multiple elements including buttons and different text styles.
      </Label>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <Button onPress={fn()}>Action 1</Button>
        <Button outline onPress={fn()}>
          Action 2
        </Button>
      </View>
    </Card>
  ),
}

export const MultipleCards: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <Card onPress={fn()}>
        <Label type="h4">Card 1</Label>
        <Label type="regular" style={{ marginTop: 4 }}>
          First card with some content
        </Label>
      </Card>

      <Card onPress={fn()}>
        <Label type="h4">Card 2</Label>
        <Label type="regular" style={{ marginTop: 4 }}>
          Second card with different content
        </Label>
      </Card>

      <Card onPress={fn()}>
        <Label type="h4">Card 3</Label>
        <Label type="regular" style={{ marginTop: 4 }}>
          Third card showing how multiple cards look together
        </Label>
      </Card>
    </View>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <Card onPress={fn()}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }}>
          <Label type="h6">🎯</Label>
        </View>
        <View style={{ flex: 1 }}>
          <Label type="h4">Card with Icon</Label>
          <Label type="regular" style={{ marginTop: 4 }}>
            This card has an icon and demonstrates layout flexibility.
          </Label>
        </View>
      </View>
    </Card>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Card>
      <Label type="h3">Non-Interactive Card</Label>
      <Label type="regular" style={{ marginTop: 8 }}>
        This card has no press handlers, so it's not interactive.
      </Label>
    </Card>
  ),
}
