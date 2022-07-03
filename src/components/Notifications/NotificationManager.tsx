import * as Notifications from "expo-notifications";
import { useEffect } from "react";

import { withPlatform } from "../../hoc/withPlatform";

export const NotificationManager = () => {
    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    });

    return null;
};

export const PlatformNotificationManager = withPlatform(NotificationManager, ["android", "ios"]);
