import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { z } from "zod";

import { Button } from "../../components/Containers/Button";
import { usePostTokenMutation } from "../../store/authorization.service";

const loginSchema = z.object({
    regno: z.preprocess((a) => parseInt(z.string().parse(a), 10), z.number().positive()),
    username: z.string().min(1),
    password: z.string().min(1),
});

type LoginSchema = z.infer<typeof loginSchema>;

export const PagerLogin: FC<{ close: () => void }> = ({ close }) => {
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
            RegNo: data.regno,
            Username: data.username,
            Password: data.password,
        });
    };

    useEffect(() => {
        if (result.isSuccess) {
            close();
        }
    }, [result]);
    return (
        <View style={{ padding: 30 }}>
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
                        autoCapitalize={"none"}
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
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.marginAfter, styles.input]}
                        placeholder="Your password"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        secureTextEntry
                        autoCapitalize={"none"}
                    />
                )}
            />
            {result.error && <Text style={styles.error}>Something went wrong during login. Please try again</Text>}
            {result.isLoading && <Text>Logging in . . .</Text>}
            {errors && <Text>{JSON.stringify(Object.keys(errors))}</Text>}
            <View style={[styles.marginBefore, styles.row]}>
                <Button style={{}} containerStyle={styles.rowLeft} outline icon="arrow-back" onPress={close}>
                    Back
                </Button>
                <Button style={{}} containerStyle={styles.rowRight} outline={false} icon="log-in" onPress={handleSubmit(onSubmit)}>
                    Log-in
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    marginAfter: {
        marginBottom: 16,
    },
    input: {
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
    row: {
        flexDirection: "row",
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
