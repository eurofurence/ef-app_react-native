import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { ComboModal } from '@/components/generic/atoms/ComboModal'

// Mock data for the stories
type MockOption = {
  id: string
  name: string
  description: string
}

const mockOptions: MockOption[] = [
  { id: '1', name: 'Option 1', description: 'First option' },
  { id: '2', name: 'Option 2', description: 'Second option' },
  { id: '3', name: 'Option 3', description: 'Third option' },
  { id: '4', name: 'Option 4', description: 'Fourth option' },
  { id: '5', name: 'Option 5', description: 'Fifth option' },
]

const ComboModalWrapper = ({
  title,
  clear,
  cancelText,
  confirmText,
  children,
}: {
  title?: string
  clear?: boolean
  cancelText?: string
  confirmText?: string
  children?: React.ReactNode
}) => {
  const [modalRef, setModalRef] = useState<any>(null)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const handleOpenModal = async () => {
    if (modalRef) {
      const result = await modalRef.pick(
        mockOptions,
        selectedItems.map((id) => mockOptions.find((opt) => opt.id === id)!)
      )
      if (result) {
        setSelectedItems(result.map((item: MockOption) => item.id))
      }
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ marginBottom: 20, fontSize: 16 }}>
        Selected: {selectedItems.length > 0 ? selectedItems.join(', ') : 'None'}
      </Text>
      <Text
        style={{
          padding: 10,
          backgroundColor: '#007AFF',
          color: 'white',
          borderRadius: 8,
          fontSize: 16,
        }}
        onPress={handleOpenModal}
      >
        Open ComboModal
      </Text>
      <ComboModal
        ref={setModalRef}
        title={title}
        clear={clear}
        cancelText={cancelText}
        confirmText={confirmText}
        getKey={(item: MockOption) => item.id}
        getLabel={(item: MockOption) => item.name}
      >
        {children}
      </ComboModal>
    </View>
  )
}

const meta = {
  title: 'Components/Atoms/ComboModal',
  component: ComboModalWrapper,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: { type: 'text' },
    },
    clear: {
      control: { type: 'boolean' },
    },
    cancelText: {
      control: { type: 'text' },
    },
    confirmText: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof ComboModalWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: () => <ComboModalWrapper />,
}

export const WithTitle: Story = {
  args: { title: 'Select Options' },
  render: () => <ComboModalWrapper title='Select Options' />,
}

export const WithoutClear: Story = {
  args: { title: 'Select Options', clear: false },
  render: () => <ComboModalWrapper title='Select Options' clear={false} />,
}

export const CustomText: Story = {
  args: {
    title: 'Custom Modal',
    cancelText: 'Go Back',
    confirmText: 'Save Selection',
  },
  render: () => (
    <ComboModalWrapper
      title='Custom Modal'
      cancelText='Go Back'
      confirmText='Save Selection'
    />
  ),
}

export const WithChildren: Story = {
  args: { title: 'Modal with Children' },
  render: () => (
    <ComboModalWrapper title='Modal with Children'>
      <View
        style={{
          padding: 10,
          backgroundColor: '#f0f0f0',
          borderRadius: 8,
          marginBottom: 10,
        }}
      >
        <Text style={{ fontSize: 14, color: '#666' }}>
          This is additional content that can be displayed in the modal.
        </Text>
      </View>
    </ComboModalWrapper>
  ),
}
