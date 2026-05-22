import {createLiveQueryCollection, eq} from "@tanstack/react-db";
import {imagesCollection} from '@/data/collections/Images';
import {announcementsCollection} from '@/data/collections/Announcements';

export const announcementsFullCollection = createLiveQueryCollection(q =>
    q.from({announcement: announcementsCollection})
        .leftJoin({image: imagesCollection},
            ({announcement, image}) => eq(announcement.ImageId, image.Id))
        .select(result => ({
            ...result.announcement,
            Image: result.image
        }))
)

