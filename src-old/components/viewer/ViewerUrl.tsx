import { ReactNativeZoomableView as ZoomableView } from "@openspacelabs/react-native-zoomable-view";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Image as ReactImage } from "react-native";

import { Image } from "../generic/atoms/Image";
import { Header } from "../generic/containers/Header";
import { platformShareIcon } from "../generic/atoms/Icon";
import { minZoomFor, shareImage } from "./Viewer.common";

const viewerPadding = 20;

export type ViewerUrlProps = {
    url: string;
    title: string;
};

export const ViewerUrl: FC<ViewerUrlProps> = ({ url, title }) => {
    const { t } = useTranslation("Viewer");
    const [width, setWidth] = useState(-1);
    const [height, setHeight] = useState(-1);

    // Try getting the image size.
    useEffect(() => {
        ReactImage.getSize(
            url,
            (width, height) => {
                // Gotten successfully.
                setWidth(width);
                setHeight(height);
            },
            () => {
                // Failed, set to 0 so that expo image starts loading.
                setWidth(0);
                setHeight(0);
            },
        );
    }, [url]);

    // Determine zoom levels.
    const minZoom = minZoomFor(width, height, viewerPadding);
    const maxZoom = minZoom * 5;

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header secondaryIcon={platformShareIcon} secondaryPress={() => title && shareImage(url, title)}>
                {title ?? t("unspecified")}
            </Header>

            {/* Require width and height be either gotten successfully or failed. */}
            {/* If failed, image loading will set the size. */}
            {width === -1 || height === -1 ? null : (
                <ZoomableView
                    style={styles.viewer}
                    contentWidth={width + viewerPadding * 2}
                    contentHeight={height + viewerPadding * 2}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    initialZoom={minZoom * 1.2}
                    bindToBorders={true}
                >
                    <View style={{ width, height }}>
                        <Image
                            style={styles.image}
                            allowDownscaling={false}
                            contentFit={undefined}
                            source={url}
                            priority="high"
                            onLoad={(event) => {
                                setWidth(event.source.width);
                                setHeight(event.source.height);
                            }}
                        />
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
