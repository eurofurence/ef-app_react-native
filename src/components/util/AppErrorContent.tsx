import { FC } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../AppStyles";
import { Label } from "../generic/atoms/Label";
import { Button } from "../generic/containers/Button";
import { Floater } from "../generic/containers/Floater";
import { useSynchronizer } from "../sync/SynchronizationProvider";

export type AppErrorContentProps = {
    error?: any;
};
export const AppErrorContent: FC<AppErrorContentProps> = ({ error }) => {
    const safe = useSafeAreaInsets();
    const sync = useSynchronizer();
    console.log(error);
    return (
        <ScrollView style={[appStyles.abs, safe]}>
            <Floater contentStyle={appStyles.trailer}>
                <Label type="h1" mt={40}>
                    Sorry, something went wrong
                </Label>

                <Label type="para" mt={20} mb={20}>
                    Please let us know that there's something going wrong. You can try clearing the cache, this will however also remove your preferences.
                </Label>
                <Button icon="trash-can-outline" onPress={sync.clear}>
                    Clear the cache
                </Button>
                <Label type="h2" mt={20} mb={20}>
                    The following error caused the crash
                </Label>
                <Label type="para" color="warning">
                    {`Message: ${error.message} ${error.componentStack}`}
                </Label>
            </Floater>
        </ScrollView>
    );
};
