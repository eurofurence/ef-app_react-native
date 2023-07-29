import { zodResolver } from "@hookform/resolvers/zod/dist/zod";
import { FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useTheme } from "../../../context/Theme";
import { useSentryProfiler } from "../../../sentryHelpers";
import { usePostTokenMutation } from "../../../store/authorization.service";
import { Label } from "../../Atoms/Label";
import { Button } from "../../Containers/Button";
import { Row } from "../../Containers/Row";
import { ManagedTextInput } from "../../FormControls";
import { LoginSchema, loginSchema } from "./LoginSchema.schema";

export type LoginFormProps = {
    style?: ViewStyle;
    close?: () => void;
};
export const LoginForm: FC<LoginFormProps> = ({ style, close }) => {
    const { t } = useTranslation("Settings", { keyPrefix: "login" });
    const theme = useTheme();
    useSentryProfiler("LoginForm");

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
    });
    const [login, result] = usePostTokenMutation();

    const onSubmit = (data: LoginSchema) => {
        login({
            // TODO: Fix types here.
            RegNo: data.regno,
            Username: data.username,
            Password: data.password,
        });
    };

    useEffect(() => {
        if (result.isSuccess && close) {
            close();
        }
    }, [result, close]);

    return (
        <View style={style}>
            <FormProvider {...form}>
                <ManagedTextInput<LoginSchema>
                    name={"username"}
                    label={t("enter_username")}
                    placeholder={t("hint_username")}
                    placeholderTextColor={theme.soften}
                    autoCapitalize={"none"}
                />

                <ManagedTextInput<LoginSchema>
                    name={"regno"}
                    label={t("enter_reg")}
                    placeholder={t("hint_reg")}
                    placeholderTextColor={theme.soften}
                    autoComplete={"username"}
                    autoCapitalize={"none"}
                    textContentType={"username"}
                    inputMode={"numeric"}
                />

                <ManagedTextInput<LoginSchema>
                    name={"password"}
                    label={t("enter_password")}
                    placeholder={t("hint_password")}
                    placeholderTextColor={theme.soften}
                    autoComplete={"password"}
                    secureTextEntry
                    autoCapitalize={"none"}
                    textContentType={"password"}
                    contextMenuHidden={false}
                />

                {result.isLoading && <Label>{t("logging_in")}</Label>}
                <Row style={styles.marginBefore}>
                    {close && (
                        <Button style={styles.rowLeft} outline icon="chevron-left" onPress={close}>
                            {t("back_button")}
                        </Button>
                    )}
                    <Button style={styles.rowRight} outline={false} icon="login" onPress={form.handleSubmit(onSubmit)}>
                        {t("login_button")}
                    </Button>
                </Row>
                <Label mt={15} variant="narrow">
                    {t("login_hint")}
                </Label>
            </FormProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 30,
    },
    marginAfter: {
        marginBottom: 16,
    },
    input: {
        width: "100%",
        borderBottomColor: "black",
        borderBottomWidth: 1,
        paddingVertical: 8,
    },
    marginBefore: {
        marginTop: 16,
    },
    rowLeft: {
        flex: 1,
        marginRight: 8,
    },
    rowRight: {
        flex: 1,
        marginLeft: 8,
    },
});
