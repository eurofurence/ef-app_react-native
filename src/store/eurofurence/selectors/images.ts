import { createSelector } from "@reduxjs/toolkit";

import { announcementsSelectors, dealersSelectors, eventsSelector, imagesSelectors } from "./records";
import { AnnouncementDetails, DealerDetails, EventDetails, ImageDetails, RecordId } from "../types";

export const selectImagesById = createSelector([imagesSelectors.selectEntities, (_state, imageIds: RecordId[]) => imageIds], (images, imageIds): ImageDetails[] =>
    imageIds.map((it) => images[it]).filter((it): it is ImageDetails => it !== undefined),
);

export type ImageLocation =
    | {
          type: "Event";
          location: "eventPoster" | "eventBanner";
          source: EventDetails;
          title: string;
      }
    | {
          type: "Dealer";
          location: "artist" | "artistThumbnail" | "artPreview";
          source: DealerDetails;
          title: string;
      }
    | {
          type: "Announcement";
          location: "announcement";
          source: AnnouncementDetails;
          title: string;
      };

export const selectImageLocations = createSelector([eventsSelector.selectAll, dealersSelectors.selectAll, announcementsSelectors.selectAll], (events, dealers, announcements) => {
    const result: Record<string, ImageLocation> = {};
    for (const event of events) {
        if (event.PosterImageId) result[event.PosterImageId] = { type: "Event", location: "eventPoster", source: event, title: event.Title };
        if (event.BannerImageId) result[event.BannerImageId] = { type: "Event", location: "eventBanner", source: event, title: event.Title };
    }
    for (const dealer of dealers) {
        if (dealer.ArtistImageId) result[dealer.ArtistImageId] = { type: "Dealer", location: "artist", source: dealer, title: dealer.FullName };
        if (dealer.ArtistThumbnailImageId) result[dealer.ArtistThumbnailImageId] = { type: "Dealer", location: "artistThumbnail", source: dealer, title: dealer.FullName };
        if (dealer.ArtPreviewImageId) result[dealer.ArtPreviewImageId] = { type: "Dealer", location: "artPreview", source: dealer, title: dealer.FullName };
    }
    for (const announcement of announcements) {
        if (announcement.ImageId) result[announcement.ImageId] = { type: "Announcement", location: "announcement", source: announcement, title: announcement.Title };
    }

    return result;
});
