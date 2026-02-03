import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { fn } from 'storybook/test'
import { Button } from '@/components/generic/containers/Button'

const meta = {
  title: 'Components/Containers/Button',
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    outline: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    icon: {
      control: { type: 'select' },
      options: [
        'heart',
        'star',
        'home',
        'account',
        'cog',
        'bell',
        'calendar',
        'map-marker',
        'share',
        'download',
        'search',
        'menu',
        'close',
        'check',
        'plus',
        'minus',
      ],
    },
    iconRight: {
      control: { type: 'select' },
      options: [
        'heart',
        'star',
        'home',
        'account',
        'cog',
        'bell',
        'calendar',
        'map-marker',
        'share',
        'download',
        'search',
        'menu',
        'close',
        'check',
        'plus',
        'minus',
      ],
    },
    labelType: {
      control: { type: 'select' },
      options: [
        'lead',
        'xl',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'caption',
        'compact',
        'regular',
        'minor',
        'cap',
        'bold',
        'extraBold',
        'lineThrough',
        'italic',
        'underlined',
        'para',
      ],
    },
    labelVariant: {
      control: { type: 'select' },
      options: [
        'regular',
        'narrow',
        'bold',
        'lineThrough',
        'underlined',
        'middle',
        'shadow',
        'receded',
      ],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Button',
    onPress: fn(),
  },
}

export const Filled: Story = {
  args: {
    children: 'Filled Button',
    onPress: fn(),
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    outline: true,
    onPress: fn(),
  },
}

export const WithIcon: Story = {
  args: {
    children: 'Button with Icon',
    icon: 'heart',
    onPress: fn(),
  },
}

export const WithRightIcon: Story = {
  args: {
    children: 'Button with Right Icon',
    iconRight: 'arrow-right',
    onPress: fn(),
  },
}

export const WithBothIcons: Story = {
  args: {
    children: 'Button with Both Icons',
    icon: 'heart',
    iconRight: 'arrow-right',
    onPress: fn(),
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    onPress: fn(),
  },
}

export const OutlineDisabled: Story = {
  args: {
    children: 'Disabled Outline Button',
    outline: true,
    disabled: true,
    onPress: fn(),
  },
}

export const ButtonVariants: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <Button onPress={fn()}>Default Button</Button>
      <Button outline onPress={fn()}>
        Outline Button
      </Button>
      <Button icon='heart' onPress={fn()}>
        With Left Icon
      </Button>
      <Button iconRight='arrow-right' onPress={fn()}>
        With Right Icon
      </Button>
      <Button icon='heart' iconRight='arrow-right' onPress={fn()}>
        With Both Icons
      </Button>
      <Button disabled onPress={fn()}>
        Disabled Button
      </Button>
      <Button outline disabled onPress={fn()}>
        Disabled Outline
      </Button>
    </View>
  ),
}

export const LabelTypes: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <Button labelType='h1' onPress={fn()}>
        Heading 1 Button
      </Button>
      <Button labelType='h2' onPress={fn()}>
        Heading 2 Button
      </Button>
      <Button labelType='h3' onPress={fn()}>
        Heading 3 Button
      </Button>
      <Button labelType='regular' onPress={fn()}>
        Regular Button
      </Button>
      <Button labelType='minor' onPress={fn()}>
        Minor Button
      </Button>
      <Button labelType='caption' onPress={fn()}>
        Caption Button
      </Button>
    </View>
  ),
}

export const LabelVariants: Story = {
  render: () => (
    <View style={{ gap: 15 }}>
      <Button labelVariant='regular' onPress={fn()}>
        Regular Variant
      </Button>
      <Button labelVariant='bold' onPress={fn()}>
        Bold Variant
      </Button>
      <Button labelVariant='lineThrough' onPress={fn()}>
        Line Through Variant
      </Button>
      <Button labelVariant='underlined' onPress={fn()}>
        Underlined Variant
      </Button>
      <Button labelVariant='receded' onPress={fn()}>
        Receded Variant
      </Button>
    </View>
  ),
}

export const Interactive: Story = {
  args: {
    children: 'Click me!',
    onPress: fn(),
    onLongPress: fn(),
  },
}
