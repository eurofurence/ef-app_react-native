import { ReactNativeZoomableView as ZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { captureException } from "@sentry/react-native";
import { Image } from "expo-image";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet, View, ViewStyle } from "react-native";

import { Header } from "../components/generic/containers/Header";
import { conAbbr } from "../configuration";
import { useAppRoute } from "../hooks/nav/useAppNavigation";
import { useAppSelector } from "../store";
import { selectImageLocations } from "../store/eurofurence/selectors/images";
import { imagesSelectors } from "../store/eurofurence/selectors/records";
import { RecordId } from "../store/eurofurence/types";

const viewerPadding = 40;

export type ViewerParams = {
    id: RecordId;
};
export const Viewer = () => {
    const { t } = useTranslation("Viewer");

    const { params } = useAppRoute("Viewer");
    const image = useAppSelector((state) => imagesSelectors.selectById(state, params.id));
    const locations = useAppSelector(selectImageLocations);
    const location = image ? locations[image.Id] : undefined;
    const title = t(location?.location ?? "unspecified", { name: location?.title });

    const styleContainer = image ? { width: image.Width, height: image.Height } : null;

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header secondaryIcon="share" secondaryPress={() => image && title && shareImage(image.FullUrl, title)}>
                {title}
            </Header>
            {!image ? null : (
                <ZoomableView
                    style={styles.viewer}
                    contentWidth={image.Width + viewerPadding * 2}
                    contentHeight={image.Height + viewerPadding * 2}
                    minZoom={1}
                    maxZoom={5}
                    bindToBorders={true}
                >
                    <View style={styleContainer}>
                        <Image style={styles.image} allowDownscaling={false} contentFit={undefined} source={image.FullUrl} />
                    </View>
                </ZoomableView>
            )}
        </View>
    );
};

export const shareImage = (url: string, title: string) =>
    Share.share(
        {
            title,
            url,
            message: `Check out ${title} on ${conAbbr}!\n${url}`,
        },
        {},
    ).catch(captureException);

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
