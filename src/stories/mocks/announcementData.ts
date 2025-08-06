import { AnnouncementDetails } from '@/context/data/types.details';

// Mock announcement data for Storybook stories
export const mockAnnouncementDetails: AnnouncementDetails = {
    Id: 'announcement-1',
    Title: 'Welcome to Eurofurence 2024!',
    NormalizedTitle: 'Welcome to Eurofurence 2024!',
    Description: 'Welcome to the biggest furry convention in Europe!',
    Image: null,
    Area: 'General',
    Start: '2024-08-15T10:00:00Z',
    End: '2024-08-15T11:00:00Z',
};

export const mockAnnouncementDetailsWithImage: AnnouncementDetails = {
    Id: 'announcement-2',
    Title: 'Fursuit Parade Starting Soon',
    NormalizedTitle: 'Fursuit Parade Starting Soon',
    Description: 'Get ready for the spectacular fursuit parade!',
    Image: 'https://example.com/parade-image.jpg',
    Area: 'Events',
    Start: '2024-08-15T14:00:00Z',
    End: '2024-08-15T16:00:00Z',
};

export const mockAnnouncementDetailsLongTitle: AnnouncementDetails = {
    Id: 'announcement-3',
    Title: 'This is a very long announcement title that might wrap to multiple lines and should be handled gracefully by the component',
    NormalizedTitle: 'This is a very long announcement title that might wrap to multiple lines and should be handled gracefully by the component',
    Description: 'A detailed announcement with a very long title to test how the component handles text overflow.',
    Image: null,
    Area: 'Information',
    Start: '2024-08-15T16:00:00Z',
    End: '2024-08-15T17:00:00Z',
};

export const mockAnnouncementDetailsDifferentAreas: AnnouncementDetails[] = [
    {
        Id: 'announcement-4',
        Title: 'General Announcement',
        NormalizedTitle: 'General Announcement',
        Description: 'A general announcement for all attendees.',
        Image: null,
        Area: 'General',
        Start: '2024-08-15T09:00:00Z',
        End: '2024-08-15T10:00:00Z',
    },
    {
        Id: 'announcement-5',
        Title: 'Events Update',
        NormalizedTitle: 'Events Update',
        Description: 'Important update about upcoming events.',
        Image: null,
        Area: 'Events',
        Start: '2024-08-15T11:00:00Z',
        End: '2024-08-15T12:00:00Z',
    },
    {
        Id: 'announcement-6',
        Title: 'Information Desk',
        NormalizedTitle: 'Information Desk',
        Description: 'Information about the help desk location.',
        Image: null,
        Area: 'Information',
        Start: '2024-08-15T13:00:00Z',
        End: '2024-08-15T14:00:00Z',
    },
    {
        Id: 'announcement-7',
        Title: 'Emergency Notice',
        NormalizedTitle: 'Emergency Notice',
        Description: 'Important emergency information.',
        Image: null,
        Area: 'Emergency',
        Start: '2024-08-15T15:00:00Z',
        End: '2024-08-15T16:00:00Z',
    },
];

// Helper function to create announcement instances
export const createAnnouncementInstance = (details: AnnouncementDetails, time: string = '2 hours ago') => {
    return {
        details,
        time,
    };
}; 