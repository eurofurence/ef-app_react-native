import type {EfAnnouncementFull} from "@/data/collections/content/AnnouncementsFull";
import type {EfImage} from "@/data/types/EfImage";

// Mock image record for testing
const mockImageRecord: EfImage = {
  Id: 'banner-1',
  InternalReference: 'banner-1-ref',
  Width: 800,
  Height: 200,
  SizeInBytes: 50000,
  MimeType: 'image/jpeg',
  ContentHashSha1: 'abc123',
  Url: 'https://picsum.photos/800/200',
  LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
  IsRestricted: false,
  BlurHash: 'L38D%z^%020303D+bv~m%IWF-nIr/1309/667'
}

// Mock announcement data for Storybook stories
export const mockAnnouncementDetails: EfAnnouncementFull = {
  Id: 'announcement-1',
  LastChangeDateTimeUtc: '2024-08-15T10:00:00Z',
  ValidFromDateTimeUtc: '2024-08-15T10:00:00Z',
  ValidUntilDateTimeUtc: '2024-08-15T11:00:00Z',
  Area: 'General',
  Author: 'Admin',
  Title: 'Welcome to Eurofurence 2024!',
  Content: 'Welcome to the biggest furry convention in Europe!',
  ImageId: undefined,
  Image: null,
  Roles: undefined
}

export const mockAnnouncementDetailsWithImage: EfAnnouncementFull = {
  Id: 'announcement-2',
  LastChangeDateTimeUtc: '2024-08-15T14:00:00Z',
  ValidFromDateTimeUtc: '2024-08-15T14:00:00Z',
  ValidUntilDateTimeUtc: '2024-08-15T16:00:00Z',
  Area: 'Events',
  Author: 'Events Team',
  Title: 'Fursuit Parade Starting Soon',
  Content: 'Get ready for the spectacular fursuit parade!',
  ImageId: 'image-1',
  Image: mockImageRecord,
  Roles: undefined
}

export const mockAnnouncementDetailsLongTitle: EfAnnouncementFull = {
  Id: 'announcement-3',
  LastChangeDateTimeUtc: '2024-08-15T16:00:00Z',
  ValidFromDateTimeUtc: '2024-08-15T16:00:00Z',
  ValidUntilDateTimeUtc: '2024-08-15T17:00:00Z',
  Area: 'Information',
  Author: 'Info Desk',
  Title:
    'This is a very long announcement title that might wrap to multiple lines and should be handled gracefully by the component',
  Content:
    'A detailed announcement with a very long title to test how the component handles text overflow.',
  ImageId: undefined,
  Image: null,
  Roles: undefined
}

export const mockAnnouncementDetailsDifferentAreas: EfAnnouncementFull[] = [
  {
    Id: 'announcement-4',
    LastChangeDateTimeUtc: '2024-08-15T09:00:00Z',
    ValidFromDateTimeUtc: '2024-08-15T09:00:00Z',
    ValidUntilDateTimeUtc: '2024-08-15T10:00:00Z',
    Area: 'General',
    Author: 'Admin',
    Title: 'General Announcement',
    Content: 'A general announcement for all attendees.',
    ImageId: undefined,
    Image: null,
    Roles: undefined
  },
  {
    Id: 'announcement-5',
    LastChangeDateTimeUtc: '2024-08-15T11:00:00Z',
    ValidFromDateTimeUtc: '2024-08-15T11:00:00Z',
    ValidUntilDateTimeUtc: '2024-08-15T12:00:00Z',
    Area: 'Events',
    Author: 'Events Team',
    Title: 'Events Update',
    Content: 'Important update about upcoming events.',
    ImageId: undefined,
    Image: null,
    Roles: undefined
  },
  {
    Id: 'announcement-6',
    LastChangeDateTimeUtc: '2024-08-15T13:00:00Z',
    ValidFromDateTimeUtc: '2024-08-15T13:00:00Z',
    ValidUntilDateTimeUtc: '2024-08-15T14:00:00Z',
    Area: 'Information',
    Author: 'Info Desk',
    Title: 'Information Desk',
    Content: 'Information about the help desk location.',
    ImageId: undefined,
    Image: null,
    Roles: undefined
  },
  {
    Id: 'announcement-7',
    LastChangeDateTimeUtc: '2024-08-15T15:00:00Z',
    ValidFromDateTimeUtc: '2024-08-15T15:00:00Z',
    ValidUntilDateTimeUtc: '2024-08-15T16:00:00Z',
    Area: 'Emergency',
    Author: 'Security',
    Title: 'Emergency Notice',
    Content: 'Important emergency information.',
    ImageId: undefined,
    Image: null,
    Roles: undefined
  },
]
