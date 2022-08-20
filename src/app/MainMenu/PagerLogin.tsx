import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { z } from "zod";

import { Label } from "../../components/Atoms/Label";
import { Button } from "../../components/Containers/Button";
import { Row } from "../../components/Containers/Row";
import { useTheme } from "../../context/Theme";
import { useSentryProfiler } from "../../sentryHelpers";
import { usePostTokenMutation } from "../../store/authorization.service";

const loginSchema = z.object({
    regno: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive()),
    username: z.string().min(1),
    password: z.string().min(1),
});

type LoginSchema = z.infer<typeof loginSchema>;

export type LoginFormProps = {
    style?: ViewStyle;
    close?: () => void;
};

export const LoginForm: FC<LoginFormProps> = ({ style, close }) => {
    const { t } = useTranslation("Settings", { keyPrefix: "login" });
    const theme = useTheme();
    useSentryProfiler("LoginForm");

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
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
            <Label type="caption">{t("enter_username")}</Label>
            {errors.username?.message && (
                <Label type="minor" color="warning">
                    {errors.username?.message}
                </Label>
            )}
            <Controller
                control={control}
                name={"username"}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.marginAfter, styles.input]}
                        placeholder={t("hint_username")}
                        placeholderTextColor={theme.soften}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCapitalize={"none"}
                    />
                )}
            />

            <Label type="caption">{t("enter_reg")}</Label>
            {errors.regno?.message && (
                <Label type="minor" color="warning">
                    {errors.regno?.message}
                </Label>
            )}

            <Controller
                control={control}
                name={"regno"}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.marginAfter, styles.input]}
                        placeholder={t("hint_reg")}
                        placeholderTextColor={theme.soften}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value?.toString()}
                        autoComplete={"username"}
                        autoCapitalize={"none"}
                        textContentType={"username"}
                        keyboardType={"numeric"}
                    />
                )}
            />
            <Label type="caption">{t("enter_password")}</Label>
            {errors.password?.message && (
                <Label type="minor" color="warning">
                    {errors.password?.message}
                </Label>
            )}

            <Controller
                control={control}
                name={"password"}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value, ...field } }) => (
                    <TextInput
                        {...field}
                        style={[styles.marginAfter, styles.input]}
                        selectTextOnFocus
                        placeholder={t("hint_password")}
                        placeholderTextColor={theme.soften}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoComplete={"password"}
                        secureTextEntry
                        autoCapitalize={"none"}
                        textContentType={"password"}
                        contextMenuHidden={false}
                    />
                )}
            />
            {result.error && (
                <Label type="minor" color="warning">
                    {t("login_error")}
                </Label>
            )}
            {result.isLoading && <Label>{t("logging_in")}</Label>}
            <Row style={styles.marginBefore}>
                {close && (
                    <Button style={styles.rowLeft} outline icon="chevron-left" onPress={close}>
                        {t("back_button")}
                    </Button>
                )}
                <Button style={styles.rowRight} outline={false} icon="login" onPress={handleSubmit(onSubmit)}>
                    {t("login_button")}
                </Button>
            </Row>
            <Label mt={15} variant="narrow">
                {t("login_hint")}
            </Label>
        </View>
    );
};

export const PagerLogin: FC<{ close: () => void }> = ({ close }) => {
    return (
        <View style={styles.container}>
            <LoginForm close={close} />
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
