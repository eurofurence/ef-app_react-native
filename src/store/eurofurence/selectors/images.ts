import { createSelector } from "@reduxjs/toolkit";

import { imagesSelectors } from "./records";
import { ImageDetails, RecordId } from "../types";

export const selectImagesById = createSelector([imagesSelectors.selectEntities, (_state, imageIds: RecordId[]) => imageIds], (images, imageIds): ImageDetails[] =>
    imageIds.map((it) => images[it]).filter((it): it is ImageDetails => it !== undefined),
);
