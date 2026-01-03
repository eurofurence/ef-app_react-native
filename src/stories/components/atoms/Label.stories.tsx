import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { fn } from 'storybook/test'
import { Label } from '@/components/generic/atoms/Label'

const meta = {
  title: 'Components/Atoms/Label',
  component: Label,
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
    variant: {
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
    color: {
      control: { type: 'select' },
      options: ['text', 'important', 'invImportant', 'white', 'lighten'],
    },
  },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'This is a default label',
  },
}

export const Headings: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Label type='h1'>Heading 1</Label>
      <Label type='h2'>Heading 2</Label>
      <Label type='h3'>Heading 3</Label>
      <Label type='h4'>Heading 4</Label>
      <Label type='h5'>Heading 5</Label>
      <Label type='h6'>Heading 6</Label>
    </View>
  ),
}

export const TypographyVariants: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Label type='lead'>Lead text with larger font size</Label>
      <Label type='xl'>Extra large text</Label>
      <Label type='regular'>Regular text</Label>
      <Label type='minor'>Minor text</Label>
      <Label type='caption'>Caption text with reduced opacity</Label>
      <Label type='compact'>Compact text</Label>
      <Label type='cap'>Cap text</Label>
    </View>
  ),
}

export const Variants: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Label variant='regular'>Regular variant</Label>
      <Label variant='receded'>Receded variant</Label>
      <Label variant='bold'>Bold variant</Label>
      <Label variant='lineThrough'>Line through variant</Label>
      <Label variant='underlined'>Underlined variant</Label>
    </View>
  ),
}

export const Colors: Story = {
  render: () => (
    <View style={{ gap: 10 }}>
      <Label color='text'>Text color</Label>
      <Label color='important'>Important color</Label>
      <Label color='invImportant'>Inverted important</Label>
      <Label color='white'>White color</Label>
      <Label color='lighten'>Lighten color</Label>
    </View>
  ),
}

export const Interactive: Story = {
  args: {
    children: 'Clickable label',
    onPress: fn(),
  },
}
