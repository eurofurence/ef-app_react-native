type RecordMetadata = {
    Id: string;
    LastChangeDateTimeUtc: string;
    IsDeleted: number;
};

export type AnnouncementRecord = RecordMetadata & {
    ValidFromDateTimeUtc: string;
    ValidUntilDateTimeUtc: string;
    ExternalReference?: string;
    Area: string;
    Author: string;
    Title: string;
    Content: string;
    ImageId: string;
};

export type EventRecord = RecordMetadata & {
    Title: string;
};
