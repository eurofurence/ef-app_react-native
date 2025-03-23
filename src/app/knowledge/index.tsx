import { KbSectionedList } from "@/components/kb/KbSectionedList";
import { Search } from "@/components/generic/atoms/Search";
import { useDataCache } from "@/context/DataCacheProvider";
import { useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { chain } from "lodash";
import Fuse from "fuse.js";

export default function Knowledge() {
    const { getAllCacheSync } = useDataCache();
    const [filter, setFilter] = useState("");

    // Get knowledge groups and entries from cache
    const knowledgeGroups = getAllCacheSync("knowledgeGroups");
    const knowledgeEntries = getAllCacheSync("knowledgeEntries");

    // Prepare data for search and display
    const groups = useMemo(() => {
        const groupsData = knowledgeGroups.map(item => item.data);
        const entriesData = knowledgeEntries.map(item => item.data);

        // Group entries by their group ID
        const groupedEntries = chain(entriesData)
            .groupBy('KnowledgeGroupId')
            .value();

        // Combine groups with their entries
        return groupsData.map(group => ({
            group,
            entries: groupedEntries[group.Id] || []
        }));
    }, [knowledgeGroups, knowledgeEntries]);

    // Setup search functionality
    const searchResults = useMemo(() => {
        if (!filter) return null;

        const allItems = chain(groups)
            .flatMap(({ group, entries }) => [group, ...entries])
            .value();

        const fuse = new Fuse(allItems, {
            keys: ['Name', 'Description', 'Text'],
            threshold: 0.3
        });

        return fuse.search(filter).map(result => result.item);
    }, [groups, filter]);

    // Prepare final data for display
    const displayData = useMemo(() => {
        if (searchResults) return searchResults;
        return chain(groups)
            .flatMap(({ group, entries }) => [group, ...entries])
            .value();
    }, [searchResults, groups]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <KbSectionedList
                kbGroups={displayData}
                leader={<Search filter={filter} setFilter={setFilter} />}
            />
        </View>
    );
}
