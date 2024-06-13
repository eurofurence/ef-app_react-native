import { FC } from "react";
import { ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../AppStyles";
import { Label } from "../generic/atoms/Label";
import { Floater } from "../generic/containers/Floater";

export type AppErrorContentProps = {
    error?: any;
};
export const AppErrorContent: FC<AppErrorContentProps> = ({ error }) => {
    console.log(error);
    return (
        <ScrollView style={{ padding: 30 }}>
            <Floater contentStyle={appStyles.trailer}>
                <Label type="h1" mt={40}>
                    Sorry, something went wrong
                </Label>

                <Label type="para" mt={20} mb={20}>
                    Please let us know that there's something going wrong. You can try clearing the cache, this will however also remove your preferences.
                </Label>
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
