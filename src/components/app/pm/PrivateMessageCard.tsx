import moment from "moment/moment";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { CommunicationRecord } from "../../../store/eurofurence.types";
import { Icon } from "../../generic/atoms/Icon";
import { Label } from "../../generic/atoms/Label";
import { Card } from "../../generic/containers/Card";
import { Col } from "../../generic/containers/Col";
import { Row } from "../../generic/containers/Row";

export type PrivateMessageCardProps = {
    onPress: (item: CommunicationRecord) => void;
    item: CommunicationRecord;
};

export const PrivateMessageCard: FC<PrivateMessageCardProps> = ({ item, onPress }) => {
    const { t } = useTranslation("PrivateMessageList");
    const onPressDelegate = useCallback(() => onPress(item), [onPress, item]);

    return (
        <View style={styles.itemPadding}>
            <Card onPress={onPressDelegate}>
                <Row>
                    <Col style={styles.title}>
                        <Label variant={item.ReadDateTimeUtc === null ? "bold" : "regular"}>{item.Subject}</Label>
                        <Label variant={item.ReadDateTimeUtc === null ? "bold" : "regular"}>
                            {t("message_item_subtitle", {
                                status: item.ReadDateTimeUtc === null ? t("unread") : t("read"),
                                time: moment(item.CreatedDateTimeUtc).format("llll"),
                            })}
                        </Label>
                    </Col>
                    <View style={styles.itemChevron}>
                        <Icon name="chevron-right" size={30} />
                    </View>
                </Row>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        flex: 6,
    },
    itemPadding: {
        paddingHorizontal: 20,
    },
    itemChevron: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 50,
        height: 50,
        borderRadius: 50,
    },
});
