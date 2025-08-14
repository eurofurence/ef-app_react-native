import { useState } from 'react'
import { View } from 'react-native'
import { fn } from 'storybook/test'

import { Search } from '@/components/generic/atoms/Search'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const meta = {
  title: 'Components/Atoms/Search',
  component: Search,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    placeholder: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

const SearchWrapper = ({ initialFilter = '', ...props }: any) => {
  const [filter, setFilter] = useState(initialFilter)
  return <Search filter={filter} setFilter={setFilter} {...props} />
}

export const Default: Story = {
  args: {
    filter: '',
    setFilter: fn(),
  },
  render: () => <SearchWrapper />,
}

export const WithPlaceholder: Story = {
  args: {
    filter: '',
    setFilter: fn(),
    placeholder: 'Search events...',
  },
  render: () => <SearchWrapper placeholder="Search events..." />,
}

export const WithInitialValue: Story = {
  args: {
    filter: 'convention',
    setFilter: fn(),
  },
  render: () => <SearchWrapper initialFilter="convention" />,
}

export const WithSubmit: Story = {
  args: {
    filter: '',
    setFilter: fn(),
    placeholder: 'Search and press enter...',
    submit: fn(),
  },
  render: () => <SearchWrapper placeholder="Search and press enter..." submit={fn()} />,
}

export const MultipleSearchBoxes: Story = {
  args: {
    filter: '',
    setFilter: fn(),
  },
  render: () => (
    <View style={{ gap: 15 }}>
      <SearchWrapper placeholder="Search events..." />
      <SearchWrapper placeholder="Search dealers..." />
      <SearchWrapper placeholder="Search announcements..." />
    </View>
  ),
}

export const Interactive: Story = {
  args: {
    filter: '',
    setFilter: fn(),
  },
  render: () => {
    const [filter1, setFilter1] = useState('')
    const [filter2, setFilter2] = useState('')

    return (
      <View style={{ gap: 20 }}>
        <Search filter={filter1} setFilter={setFilter1} placeholder="Search events..." submit={fn()} />
        <Search filter={filter2} setFilter={setFilter2} placeholder="Search dealers..." submit={fn()} />
      </View>
    )
  },
}
