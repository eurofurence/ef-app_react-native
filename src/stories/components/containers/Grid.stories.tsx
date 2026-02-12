import type { Meta, StoryObj } from '@storybook/react-native-web-vite'
import { Text, View } from 'react-native'
import { Grid } from '@/components/generic/containers/Grid'

const meta = {
  title: 'Components/Containers/Grid',
  component: Grid,
  decorators: [
    (Story) => (
      <View style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    cols: {
      control: { type: 'range', min: 1, max: 4, step: 1 },
    },
  },
} satisfies Meta<typeof Grid>

export default meta
type Story = StoryObj<typeof meta>

const GridItem = ({
  text,
  color = '#007AFF',
}: {
  text: string
  color?: string
}) => (
  <View
    style={{
      padding: 15,
      backgroundColor: color,
      borderRadius: 8,
      minHeight: 80,
      justifyContent: 'center',
    }}
  >
    <Text
      style={{
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
      }}
    >
      {text}
    </Text>
  </View>
)

export const Default: Story = {
  args: {
    cols: 2,
    children: (
      <>
        <GridItem text='Item 1' />
        <GridItem text='Item 2' color='#34C759' />
        <GridItem text='Item 3' color='#FF9500' />
        <GridItem text='Item 4' color='#FF3B30' />
      </>
    ),
  },
}

export const ThreeColumns: Story = {
  args: {
    cols: 3,
    children: (
      <>
        <GridItem text='Item 1' />
        <GridItem text='Item 2' color='#34C759' />
        <GridItem text='Item 3' color='#FF9500' />
        <GridItem text='Item 4' color='#FF3B30' />
        <GridItem text='Item 5' color='#5856D6' />
        <GridItem text='Item 6' color='#AF52DE' />
      </>
    ),
  },
}

export const FourColumns: Story = {
  args: {
    cols: 4,
    children: (
      <>
        <GridItem text='1' />
        <GridItem text='2' color='#34C759' />
        <GridItem text='3' color='#FF9500' />
        <GridItem text='4' color='#FF3B30' />
        <GridItem text='5' color='#5856D6' />
        <GridItem text='6' color='#AF52DE' />
        <GridItem text='7' color='#FF2D92' />
        <GridItem text='8' color='#30D158' />
      </>
    ),
  },
}

export const SingleColumn: Story = {
  args: {
    cols: 1,
    children: (
      <>
        <GridItem text='Single Column Item 1' />
        <GridItem text='Single Column Item 2' color='#34C759' />
        <GridItem text='Single Column Item 3' color='#FF9500' />
        <GridItem text='Single Column Item 4' color='#FF3B30' />
      </>
    ),
  },
}

export const IncompleteRow: Story = {
  args: {
    cols: 3,
    children: (
      <>
        <GridItem text='Item 1' />
        <GridItem text='Item 2' color='#34C759' />
        <GridItem text='Item 3' color='#FF9500' />
        <GridItem text='Item 4' color='#FF3B30' />
        <GridItem text='Item 5' color='#5856D6' />
        {/* Missing Item 6 to show incomplete row */}
      </>
    ),
  },
}

export const WithCustomStyle: Story = {
  args: {
    cols: 2,
    style: { padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
    children: (
      <>
        <GridItem text='Styled Item 1' />
        <GridItem text='Styled Item 2' color='#34C759' />
        <GridItem text='Styled Item 3' color='#FF9500' />
        <GridItem text='Styled Item 4' color='#FF3B30' />
      </>
    ),
  },
}

export const DifferentSizes: Story = {
  render: () => (
    <View style={{ gap: 20 }}>
      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>2 Columns</Text>
        <Grid cols={2}>
          <GridItem text='Small' />
          <GridItem text='Grid' color='#34C759' />
        </Grid>
      </View>

      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>3 Columns</Text>
        <Grid cols={3}>
          <GridItem text='Medium' />
          <GridItem text='Grid' color='#34C759' />
          <GridItem text='Layout' color='#FF9500' />
        </Grid>
      </View>

      <View>
        <Text style={{ marginBottom: 10, fontWeight: 'bold' }}>4 Columns</Text>
        <Grid cols={4}>
          <GridItem text='Large' />
          <GridItem text='Grid' color='#34C759' />
          <GridItem text='Layout' color='#FF9500' />
          <GridItem text='Example' color='#FF3B30' />
        </Grid>
      </View>
    </View>
  ),
}
