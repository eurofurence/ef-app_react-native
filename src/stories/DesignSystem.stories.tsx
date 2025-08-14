import { View, ScrollView } from 'react-native'
import { fn } from 'storybook/test'

import { AnnouncementCard } from '@/components/announce/AnnouncementCard'
import { DealerCard } from '@/components/dealers/DealerCard'
import { EventCard, eventInstanceForAny } from '@/components/events/EventCard'
import { Icon } from '@/components/generic/atoms/Icon'
import { Label } from '@/components/generic/atoms/Label'
import { Button } from '@/components/generic/containers/Button'
import { Card } from '@/components/generic/containers/Card'
import { mockAnnouncementDetails, createAnnouncementInstance } from '@/stories/mocks/announcementData'
import { mockDealerDetails, createDealerInstance } from '@/stories/mocks/dealerData'
import { mockEventDetails } from '@/stories/mocks/eventData'

import type { Meta, StoryObj } from '@storybook/react-native-web-vite'

const DesignSystemOverview = () => (
  <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
    <Label type="h1" style={{ marginBottom: 20 }}>
      Eurofurence Design System
    </Label>

    {/* Typography Section */}
    <Card style={{ marginBottom: 20 }}>
      <Label type="h2" style={{ marginBottom: 15 }}>
        Typography
      </Label>
      <View style={{ gap: 10 }}>
        <Label type="h1">Heading 1</Label>
        <Label type="h2">Heading 2</Label>
        <Label type="h3">Heading 3</Label>
        <Label type="h4">Heading 4</Label>
        <Label type="h5">Heading 5</Label>
        <Label type="h6">Heading 6</Label>
        <Label type="lead">Lead text with larger font size</Label>
        <Label type="regular">Regular text</Label>
        <Label type="minor">Minor text</Label>
        <Label type="caption">Caption text with reduced opacity</Label>
      </View>
    </Card>

    {/* Icons Section */}
    <Card style={{ marginBottom: 20 }}>
      <Label type="h2" style={{ marginBottom: 15 }}>
        Icons
      </Label>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 15 }}>
        <Icon name="heart" size={24} color="#ff0000" />
        <Icon name="star" size={24} color="#ffd700" />
        <Icon name="home" size={24} color="#000000" />
        <Icon name="account" size={24} color="#000000" />
        <Icon name="cog" size={24} color="#000000" />
        <Icon name="bell" size={24} color="#000000" />
        <Icon name="calendar" size={24} color="#000000" />
        <Icon name="map-marker" size={24} color="#000000" />
      </View>
    </Card>

    {/* Buttons Section */}
    <Card style={{ marginBottom: 20 }}>
      <Label type="h2" style={{ marginBottom: 15 }}>
        Buttons
      </Label>
      <View style={{ gap: 10 }}>
        <Button onPress={fn()}>Default Button</Button>
        <Button outline onPress={fn()}>
          Outline Button
        </Button>
        <Button icon="heart" onPress={fn()}>
          Button with Icon
        </Button>
        <Button iconRight="arrow-right" onPress={fn()}>
          Button with Right Icon
        </Button>
        <Button disabled onPress={fn()}>
          Disabled Button
        </Button>
      </View>
    </Card>

    {/* Cards Section */}
    <Card style={{ marginBottom: 20 }}>
      <Label type="h2" style={{ marginBottom: 15 }}>
        Cards
      </Label>
      <View style={{ gap: 15 }}>
        <Card onPress={fn()}>
          <Label type="h3">Clickable Card</Label>
          <Label type="regular" style={{ marginTop: 8 }}>
            This is a clickable card with some content.
          </Label>
        </Card>
        <Card>
          <Label type="h3">Static Card</Label>
          <Label type="regular" style={{ marginTop: 8 }}>
            This is a static card without interaction.
          </Label>
        </Card>
      </View>
    </Card>

    {/* Event Card Section */}
    <Card style={{ marginBottom: 20 }}>
      <Label type="h2" style={{ marginBottom: 15 }}>
        Event Cards
      </Label>
      <EventCard event={eventInstanceForAny(mockEventDetails, new Date())} onPress={fn()} />
    </Card>

    {/* Announcement Card Section */}
    <Card style={{ marginBottom: 20 }}>
      <Label type="h2" style={{ marginBottom: 15 }}>
        Announcement Cards
      </Label>
      <AnnouncementCard announcement={createAnnouncementInstance(mockAnnouncementDetails)} onPress={fn()} />
    </Card>

    {/* Dealer Card Section */}
    <Card style={{ marginBottom: 20 }}>
      <Label type="h2" style={{ marginBottom: 15 }}>
        Dealer Cards
      </Label>
      <DealerCard dealer={createDealerInstance(mockDealerDetails)} onPress={fn()} />
    </Card>

    {/* Color Palette Section */}
    <Card style={{ marginBottom: 20 }}>
      <Label type="h2" style={{ marginBottom: 15 }}>
        Color Variants
      </Label>
      <View style={{ gap: 10 }}>
        <Label color="text">Text color</Label>
        <Label color="important">Important color</Label>
        <Label color="invImportant">Inverted important</Label>
        <Label color="white">White color</Label>
        <Label color="lighten">Lighten color</Label>
      </View>
    </Card>

    {/* Text Variants Section */}
    <Card style={{ marginBottom: 20 }}>
      <Label type="h2" style={{ marginBottom: 15 }}>
        Text Variants
      </Label>
      <View style={{ gap: 10 }}>
        <Label variant="regular">Regular variant</Label>
        <Label variant="receded">Receded variant</Label>
        <Label variant="bold">Bold variant</Label>
        <Label variant="lineThrough">Line through variant</Label>
        <Label variant="underlined">Underlined variant</Label>
      </View>
    </Card>
  </ScrollView>
)

const meta = {
  title: 'Design System/Overview',
  component: DesignSystemOverview,
  decorators: [
    (Story) => (
      <View style={{ flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof DesignSystemOverview>

export default meta
type Story = StoryObj<typeof meta>

export const Overview: Story = {
  render: () => <DesignSystemOverview />,
}
