import { createSelector } from "@reduxjs/toolkit";
import { chain, orderBy } from "lodash";

import { knowledgeEntriesSelectors, knowledgeGroupsSelectors } from "./records";

export const selectKnowledgeItems = createSelector([knowledgeGroupsSelectors.selectEntities, knowledgeEntriesSelectors.selectAll], (groups, entries) =>
    chain(entries)
        .groupBy("KnowledgeGroupId")
        .map((entries, groupId) => ({
            group: groups[groupId]!, // todo null erasure?
            entries: orderBy(entries, "Order"),
        }))
        .orderBy((it) => it.group.Order)
        .value(),
);
