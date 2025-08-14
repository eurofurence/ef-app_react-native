import { useState } from 'react'
import { View } from 'react-native'

import { ChoiceButtons } from '@/components/generic/atoms/ChoiceButtons'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Atoms/ChoiceButtons',
  component: ChoiceButtons,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#ffffff' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
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
      options: ['regular', 'narrow', 'bold', 'lineThrough', 'underlined', 'middle', 'shadow', 'receded'],
    },
  },
} satisfies Meta<typeof ChoiceButtons>

export default meta
type Story = StoryObj<typeof meta>

const ChoiceButtonsWrapper = ({ choices, initialChoice, ...props }: any) => {
  const [choice, setChoice] = useState(initialChoice || choices[0])
  return <ChoiceButtons choices={choices} choice={choice} setChoice={setChoice} getLabel={(item) => item} {...props} />
}

export const Default: Story = {
  args: {
    choices: ['Option 1', 'Option 2', 'Option 3'],
    choice: 'Option 1',
    setChoice: () => {},
    getLabel: (item: unknown) => item as string,
  },
  render: () => <ChoiceButtonsWrapper choices={['Option 1', 'Option 2', 'Option 3']} />,
}

export const TwoOptions: Story = {
  args: {
    choices: ['Yes', 'No'],
    choice: 'Yes',
    setChoice: () => {},
    getLabel: (item: unknown) => item as string,
  },
  render: () => <ChoiceButtonsWrapper choices={['Yes', 'No']} />,
}

export const FourOptions: Story = {
  args: {
    choices: ['Small', 'Medium', 'Large', 'Extra Large'],
    choice: 'Small',
    setChoice: () => {},
    getLabel: (item: unknown) => item as string,
  },
  render: () => <ChoiceButtonsWrapper choices={['Small', 'Medium', 'Large', 'Extra Large']} />,
}

export const WithCustomLabels: Story = {
  args: {
    choices: [{ id: 'light', label: 'Light Theme' }],
    choice: { id: 'light', label: 'Light Theme' },
    setChoice: () => {},
    getLabel: (item: any) => item.label,
  },
  render: () => (
    <ChoiceButtonsWrapper
      choices={[
        { id: 'light', label: 'Light Theme' },
        { id: 'dark', label: 'Dark Theme' },
        { id: 'auto', label: 'Auto' },
      ]}
      getLabel={(item: any) => item.label}
    />
  ),
}

export const WithCustomStyling: Story = {
  args: {
    choices: ['Option A', 'Option B', 'Option C'],
    choice: 'Option A',
    setChoice: () => {},
    getLabel: (item: unknown) => item as string,
    labelType: 'h4',
    labelVariant: 'bold',
  },
  render: () => <ChoiceButtonsWrapper choices={['Option A', 'Option B', 'Option C']} labelType="h4" labelVariant="bold" />,
}

export const Interactive: Story = {
  args: {
    choices: ['Option 1', 'Option 2', 'Option 3'],
    choice: 'Option 1',
    setChoice: () => {},
    getLabel: (item: unknown) => item as string,
  },
  render: () => {
    const [choice, setChoice] = useState('Option 1')
    return (
      <View style={{ gap: 20 }}>
        <ChoiceButtons choices={['Option 1', 'Option 2', 'Option 3']} choice={choice} setChoice={setChoice} getLabel={(item: unknown) => item as string} />
        <View style={{ padding: 10, backgroundColor: '#e0e0e0', borderRadius: 8 }}>
          <ChoiceButtons choices={['Red', 'Green', 'Blue']} choice={choice} setChoice={setChoice} getLabel={(item: unknown) => item as string} />
        </View>
      </View>
    )
  },
}
