import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { z } from "zod";

import { Button } from "../../components/Containers/Button";
import { Row } from "../../components/Containers/Row";
import { usePostTokenMutation } from "../../store/authorization.service";

const loginSchema = z.object({
    regno: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive()),
    username: z.string().min(1),
    password: z.string().min(1),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const LoginForm: FC<{ close?: () => void }> = ({ close }) => {
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
        <View>
            <Text>Enter your username</Text>
            {errors.username?.message && <Text style={styles.error}>{errors.username?.message}</Text>}
            <Controller
                control={control}
                name={"username"}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.marginAfter, styles.input]}
                        placeholder="Your username"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        autoCapitalize={"none"}
                    />
                )}
            />

            <Text>Enter your registration number</Text>
            {errors.regno?.message && <Text style={styles.error}>{errors.regno?.message}</Text>}

            <Controller
                control={control}
                name={"regno"}
                rules={{
                    required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.marginAfter, styles.input]}
                        placeholder="Your registration number"
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
            <Text>Enter your password</Text>
            {errors.password?.message && <Text style={styles.error}>{errors.password?.message}</Text>}

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
                        placeholder="Your password"
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
            {result.error && <Text style={styles.error}>Something went wrong during login. Please try again</Text>}
            {result.isLoading && <Text>Logging in . . .</Text>}
            <Row style={styles.marginBefore}>
                {close && (
                    <Button style={styles.rowLeft} outline icon="chevron-left" onPress={close}>
                        Back
                    </Button>
                )}
                <Button style={styles.rowRight} outline={false} icon="login" onPress={handleSubmit(onSubmit)}>
                    Log-in
                </Button>
            </Row>
        </View>
    );
};

export const PagerLogin: FC<{ close: () => void }> = ({ close }) => {
    return (
        <View style={{ padding: 30 }}>
            <LoginForm close={close} />
        </View>
    );
};

const styles = StyleSheet.create({
    marginAfter: {
        marginBottom: 16,
    },
    input: {
        width: "100%",
        borderBottomColor: "black",
        borderBottomWidth: 1,
        paddingVertical: 8,
    },
    error: {
        fontSize: 10,
        color: "#a01010",
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
