import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import React from 'react'

import { Header } from '@/components/generic/containers/Header'
import { IconNames } from '@/components/generic/atoms/Icon'

// Wrapper component to handle Header's union type
const HeaderWrapper = ({
  children,
  loading,
  secondaryIcon,
  secondaryPress,
}: {
  children?: React.ReactNode
  loading?: boolean
  secondaryIcon?: IconNames
  secondaryPress?: () => void
}) => {
  // Handle the union type properly
  if (secondaryIcon && secondaryPress) {
    return (
      <Header secondaryIcon={secondaryIcon} secondaryPress={secondaryPress} loading={loading}>
        {children}
      </Header>
    )
  } else {
    return <Header loading={loading}>{children}</Header>
  }
}

const meta = {
  title: 'Components/Containers/Header',
  component: HeaderWrapper,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    loading: {
      control: { type: 'boolean' },
    },
    secondaryIcon: {
      control: { type: 'select' },
      options: ['home', 'star', 'cog', 'plus', 'minus', 'check'],
    },
    children: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof HeaderWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Header Title',
  },
}

export const WithSecondaryAction: Story = {
  args: {
    children: 'Header with Action',
    secondaryIcon: 'cog',
    secondaryPress: () => console.log('Secondary action pressed'),
  },
}

export const Loading: Story = {
  args: {
    children: 'Loading Header',
    loading: true,
  },
}

export const NotLoading: Story = {
  args: {
    children: 'Not Loading Header',
    loading: false,
  },
}

export const LongTitle: Story = {
  args: {
    children: 'This is a very long header title that should demonstrate how the component handles text overflow and wrapping in different scenarios',
  },
}

export const WithDifferentIcons: Story = {
  args: {},
  render: () => (
    <View style={{ gap: 20 }}>
      <HeaderWrapper secondaryIcon="home" secondaryPress={() => console.log('Home pressed')}>
        Home Header
      </HeaderWrapper>

      <HeaderWrapper secondaryIcon="star" secondaryPress={() => console.log('Star pressed')}>
        Star Header
      </HeaderWrapper>

      <HeaderWrapper secondaryIcon="cog" secondaryPress={() => console.log('Cog pressed')}>
        Settings Header
      </HeaderWrapper>

      <HeaderWrapper secondaryIcon="plus" secondaryPress={() => console.log('Plus pressed')}>
        Add Header
      </HeaderWrapper>
    </View>
  ),
}

export const LoadingStates: Story = {
  args: {},
  render: () => (
    <View style={{ gap: 20 }}>
      <HeaderWrapper loading={true}>Loading Header</HeaderWrapper>

      <HeaderWrapper loading={false}>Not Loading Header</HeaderWrapper>

      <HeaderWrapper>Default Header (no loading prop)</HeaderWrapper>
    </View>
  ),
}
