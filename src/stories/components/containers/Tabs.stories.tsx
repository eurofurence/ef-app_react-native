import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import type React from 'react'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { Tabs } from '@/components/generic/containers/Tabs'

const meta = {
  title: 'Components/Containers/Tabs',
  component: Tabs,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    textMore: {
      control: { type: 'text' },
    },
    textLess: {
      control: { type: 'text' },
    },
    activity: {
      control: { type: 'boolean' },
    },
    notice: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

// Simple tabs component for Storybook that doesn't use navigation
const SimpleTabs = ({
  tabs,
  textMore,
  textLess,
  notice,
}: {
  tabs: any[]
  textMore?: string
  textLess?: string
  notice?: string | React.ReactNode
}) => {
  const [activeTab, setActiveTab] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const handleTabPress = (index: number) => {
    setActiveTab(index)
  }

  const tabItems = tabs.map((tab, index) => ({
    ...tab,
    active: index === activeTab,
    onPress: () => handleTabPress(index),
  }))

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {notice && (
        <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
          <Text>{notice}</Text>
        </View>
      )}

      <View
        style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#ccc' }}
      >
        {tabItems.map((tab) => (
          <View
            key={tab.text}
            style={{ flex: 1, padding: 10, alignItems: 'center' }}
          >
            <Text style={{ color: tab.active ? '#007AFF' : '#666' }}>
              {tab.text}
            </Text>
          </View>
        ))}

        <View style={{ flex: 1, padding: 10, alignItems: 'center' }}>
          <Text onPress={() => setIsOpen(!isOpen)}>
            {isOpen ? textLess || 'Less' : textMore || 'More'}
          </Text>
        </View>
      </View>

      {isOpen && (
        <View style={{ padding: 20, backgroundColor: '#f9f9f9' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            Content for {tabs[activeTab]?.text || 'Unknown'} Tab
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            This is the content area that appears when the more button is
            pressed. It can contain any content you want to display.
          </Text>
        </View>
      )}
    </View>
  )
}

export const Default: Story = {
  args: {
    tabs: [
      { icon: 'home', text: 'Home' },
      { icon: 'star', text: 'Starred' },
      { icon: 'cog', text: 'Settings' },
      { icon: 'plus', text: 'Add' },
    ],
  },
  render: (args) => <SimpleTabs {...args} />,
}

export const WithMoreText: Story = {
  args: {
    tabs: [
      { icon: 'home', text: 'Home' },
      { icon: 'star', text: 'Starred' },
      { icon: 'cog', text: 'Settings' },
      { icon: 'plus', text: 'Add' },
    ],
    textMore: 'Show More',
    textLess: 'Show Less',
  },
  render: (args) => <SimpleTabs {...args} />,
}

export const WithActivity: Story = {
  args: {
    tabs: [
      { icon: 'home', text: 'Home' },
      { icon: 'star', text: 'Starred' },
      { icon: 'cog', text: 'Settings' },
      { icon: 'plus', text: 'Add' },
    ],
    activity: true,
  },
  render: (args) => <SimpleTabs {...args} />,
}

export const WithNotice: Story = {
  args: {
    tabs: [
      { icon: 'home', text: 'Home' },
      { icon: 'star', text: 'Starred' },
      { icon: 'cog', text: 'Settings' },
      { icon: 'plus', text: 'Add' },
    ],
    notice: 'Important notice: New features available!',
  },
  render: (args) => <SimpleTabs {...args} />,
}

export const WithIndicators: Story = {
  args: {
    tabs: [
      { icon: 'home', text: 'Home' },
      { icon: 'star', text: 'Starred', indicate: true },
      {
        icon: 'cog',
        text: 'Settings',
        indicate: <Text style={{ color: 'white', fontSize: 10 }}>5</Text>,
      },
      { icon: 'plus', text: 'Add' },
    ],
  },
  render: (args) => <SimpleTabs {...args} />,
}

export const ManyTabs: Story = {
  args: {
    tabs: [
      { icon: 'home', text: 'Home' },
      { icon: 'star', text: 'Starred' },
      { icon: 'cog', text: 'Settings' },
      { icon: 'plus', text: 'Add' },
      { icon: 'minus', text: 'Remove' },
      { icon: 'check', text: 'Check' },
      { icon: 'timer', text: 'Timer' },
      { icon: 'key', text: 'Key' },
    ],
  },
  render: (args) => <SimpleTabs {...args} />,
}

export const ComplexExample: Story = {
  args: {
    tabs: [
      { icon: 'home', text: 'Home' },
      { icon: 'star', text: 'Starred', indicate: true },
      {
        icon: 'cog',
        text: 'Settings',
        indicate: <Text style={{ color: 'white', fontSize: 10 }}>12</Text>,
      },
      { icon: 'plus', text: 'Add' },
      { icon: 'minus', text: 'Remove' },
    ],
    textMore: 'More Options',
    textLess: 'Less Options',
    activity: true,
    notice: 'You have 3 new notifications',
  },
  render: (args) => <SimpleTabs {...args} />,
}
