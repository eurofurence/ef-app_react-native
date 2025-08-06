import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { View } from 'react-native'
import { fn } from 'storybook/test'

import { MarkdownContent } from '@/components/generic/atoms/MarkdownContent'

const meta = {
  title: 'Components/Atoms/MarkdownContent',
  component: MarkdownContent,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    defaultType: {
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
  },
} satisfies Meta<typeof MarkdownContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '# Welcome to Eurofurence\n\nThis is a **bold** event with *italic* text.',
  },
}

export const Headings: Story = {
  args: {
    children: `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6`,
  },
}

export const TextFormatting: Story = {
  args: {
    children: `**Bold text** and *italic text* and ~~strikethrough text~~

You can also use \`inline code\` and create [links](https://example.com).`,
  },
}

export const Lists: Story = {
  args: {
    children: `## Unordered List
- Item 1
- Item 2
- Item 3

## Ordered List
1. First item
2. Second item
3. Third item`,
  },
}

export const CodeBlocks: Story = {
  args: {
    children: `## Code Example

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

Inline \`code\` can also be used.`,
  },
}

export const LinksAndImages: Story = {
  args: {
    children: `## Links and Images

[Visit our website](https://www.eurofurence.org)

![Example Image](https://picsum.photos/200/100)

> This is a blockquote with some important information.`,
  },
}

export const ComplexContent: Story = {
  args: {
    children: `# Event Description

This is a **fantastic event** that will feature:

## Schedule
- **10:00 AM** - Opening Ceremony
- **2:00 PM** - Main Event
- **6:00 PM** - Closing

## Important Notes
> Please arrive 15 minutes early

For more information, visit [our website](https://example.com).

\`\`\`
Registration required
\`\`\``,
  },
}

export const WithCustomType: Story = {
  args: {
    children: '# Custom Type Content\n\nThis uses a custom defaultType.',
    defaultType: 'lead',
  },
}
