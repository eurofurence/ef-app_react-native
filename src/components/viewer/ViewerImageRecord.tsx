import { ReactNativeZoomableView as ZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useAppSelector } from "../../store";
import { selectImageLocations } from "../../store/eurofurence/selectors/images";
import { imagesSelectors } from "../../store/eurofurence/selectors/records";
import { RecordId } from "../../store/eurofurence/types";
import { Image } from "../generic/atoms/Image";
import { Header } from "../generic/containers/Header";
import { platformShareIcon } from "../generic/atoms/Icon";
import { minZoomFor, shareImage } from "./Viewer.common";

const viewerPadding = 20;

export type ViewerImageRecordProps = {
    id: RecordId;
};

export const ViewerImageRecord: FC<ViewerImageRecordProps> = ({ id }) => {
    const { t } = useTranslation("Viewer");
    const image = useAppSelector((state) => imagesSelectors.selectById(state, id));
    const locations = useAppSelector(selectImageLocations);
    const location = image ? locations[image.Id] : undefined;
    const title = t(location?.location ?? "unspecified", { name: location?.title });

    const styleContainer = image ? { width: image.Width, height: image.Height } : null;

    // Determine zoom levels.
    const minZoom = minZoomFor(image?.Width ?? 0, image?.Height ?? 0, viewerPadding);
    const maxZoom = minZoom * 5;

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header secondaryIcon={platformShareIcon} secondaryPress={() => image && title && shareImage(image.Url, title)}>
                {title}
            </Header>
            {!image ? null : (
                <ZoomableView
                    style={styles.viewer}
                    contentWidth={image.Width + viewerPadding * 2}
                    contentHeight={image.Height + viewerPadding * 2}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    initialZoom={minZoom * 1.2}
                    bindToBorders={true}
                >
                    <View style={styleContainer}>
                        <Image style={styles.image} allowDownscaling={false} contentFit={undefined} source={image.Url} priority="high" />
                    </View>
                </ZoomableView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    viewer: {
        width: "100%",
        flex: 1,
    },
    image: {
        width: "100%",
        height: "100%",
        padding: viewerPadding,
    },
});
